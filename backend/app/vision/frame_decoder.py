"""Base64 browser-frame decoding utilities."""

import base64
import binascii

import cv2
import numpy as np


class FrameDecodeError(ValueError):
    """Raised when an incoming browser frame cannot be decoded."""


def decode_jpeg_frame(encoded_image: str) -> np.ndarray:
    """Decode a Base64 JPEG payload into an OpenCV BGR frame."""
    payload = encoded_image.split(",", 1)[-1]
    try:
        image_bytes = base64.b64decode(payload, validate=True)
    except (ValueError, binascii.Error) as error:
        raise FrameDecodeError("Image is not valid Base64 data") from error

    encoded_array = np.frombuffer(image_bytes, dtype=np.uint8)
    frame = cv2.imdecode(encoded_array, cv2.IMREAD_COLOR)
    if frame is None:
        raise FrameDecodeError("Image is not a valid JPEG frame")
    return frame
