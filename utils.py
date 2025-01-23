import pandas as pd
from urllib.parse import urlparse
import io

def validate_url(url: str) -> bool:
    """
    Validates if the given string is a proper URL.
    """
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False

def export_to_csv(df: pd.DataFrame) -> str:
    """
    Converts DataFrame to CSV string for download.
    """
    buffer = io.StringIO()
    df.to_csv(buffer, index=False)
    return buffer.getvalue()
