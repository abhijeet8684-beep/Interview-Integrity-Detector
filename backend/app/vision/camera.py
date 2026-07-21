"""Local webcam capture adapter."""

from threading import Lock

import cv2
import numpy as np

from app.utils.logger import get_logger

logger = get_logger(__name__)


class Camera:
    """Safely manages a single local OpenCV webcam capture device."""

    def __init__(self, camera_index: int) -> None:
        self._camera_index = camera_index
        self._capture: cv2.VideoCapture | None = None
        self._lock = Lock()

    def read_frame(self) -> np.ndarray | None:
        """Read one frame from the configured camera, if it is accessible."""
        with self._lock:
            if not self._open_if_needed():
                return None

            success, frame = self._capture.read()  # type: ignore[union-attr]
            if success:
                return frame

            logger.warning("Unable to read a frame from camera index %s", self._camera_index)
            self.release()
            return None

    def release(self) -> None:
        """Release the webcam device when the application stops."""
        if self._capture is not None:
            self._capture.release()
            self._capture = None

    def _open_if_needed(self) -> bool:
        """Open the device lazily so startup does not reserve the camera."""
        if self._capture is not None and self._capture.isOpened():
            return True

        self.release()
        self._capture = cv2.VideoCapture(self._camera_index)
        if self._capture.isOpened():
            return True

        logger.warning("Camera index %s is unavailable", self._camera_index)
        self.release()
        return False
