import os
from dotenv import load_dotenv

load_dotenv()

# probably overkill for now but might need more config later
class Config:
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    MODEL_UPLOAD_PATH = os.getenv("MODEL_UPLOAD_PATH", "./uploads")
    
    # thresholds for compliance scoring
    BIAS_THRESHOLD = 0.1
    FAIRNESS_THRESHOLD = 0.8
    DISPARATE_IMPACT_MIN = 0.8
    
    # cern compliance weights
    TRANSPARENCY_WEIGHT = 0.2
    ACCOUNTABILITY_WEIGHT = 0.2
    FAIRNESS_WEIGHT = 0.4
    SAFETY_WEIGHT = 0.2

config = Config()
