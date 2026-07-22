"""Rule-based risk assessment for implemented face-detection states."""

from dataclasses import dataclass


@dataclass(frozen=True)
class RiskAssessment:
    """Risk values derived from the current monitoring signals."""

    score: int
    status: str
    recommendation: str


class RiskEngine:
    """Applies transparent rules without using an AI scoring model."""

    def assess(self, face_detection_status: str) -> RiskAssessment:
        """Calculate risk from documented face-detection rules."""
        score = 0
        if face_detection_status in {"Face Missing", "No Face"}:
            score += 40
        elif face_detection_status == "Multiple Faces":
            score += 60
        elif face_detection_status in {"Detected", "One Face Detected"}:
            score += 10

        score = max(0, min(score, 100))
        if score <= 20:
            return RiskAssessment(score, "System Ready", "Monitoring")
        if score <= 50:
            return RiskAssessment(score, "Attention Required", "Review Session")
        return RiskAssessment(score, "High Risk", "Investigate")
