import uuid
import csv
import json
import logging
import os
from typing import List, Optional, Dict, Any
from datetime import datetime

from app.config import settings
from app.schemas.api import ReportInfo, DataMode

logger = logging.getLogger(__name__)

REPORTS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "outputs", "reports")
os.makedirs(REPORTS_DIR, exist_ok=True)

_reports: List[ReportInfo] = []


class ReportService:
    """Service for generating and managing weather reports."""

    def __init__(self):
        pass

    def generate_report(
        self, city: str, weather_data: List[Dict[str, Any]],
        fmt: str = "csv", data_mode: DataMode = DataMode.LIVE,
    ) -> ReportInfo:
        """Generate a CSV or JSON report for a city."""
        report_id = str(uuid.uuid4())
        timestamp = datetime.utcnow()
        filename = f"weather_report_{city}_{timestamp.strftime('%Y%m%d_%H%M%S')}.{fmt}"
        filepath = os.path.join(REPORTS_DIR, filename)

        record_count = len(weather_data)

        if fmt == "csv":
            self._write_csv(filepath, weather_data)
        else:
            self._write_json(filepath, weather_data, city, data_mode)

        report_info = ReportInfo(
            id=report_id,
            city=city,
            generated_at=timestamp,
            format=fmt,
            filename=filename,
            record_count=record_count,
            data_mode=data_mode,
        )
        _reports.append(report_info)
        logger.info(f"Generated {fmt} report: {filename} ({record_count} records)")
        return report_info

    def _write_csv(self, filepath: str, data: List[Dict[str, Any]]) -> None:
        if not data:
            with open(filepath, "w", newline="", encoding="utf-8") as f:
                f.write("")
            return
        fieldnames = data[0].keys()
        with open(filepath, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(data)

    def _write_json(
        self, filepath: str, data: List[Dict[str, Any]],
        city: str, data_mode: DataMode,
    ) -> None:
        report = {
            "city": city,
            "generated_at": datetime.utcnow().isoformat(),
            "data_mode": data_mode.value,
            "record_count": len(data),
            "records": data,
        }
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, default=str)

    def get_reports(self) -> List[ReportInfo]:
        """Get list of all generated reports."""
        return list(_reports)

    def get_report_path(self, filename: str) -> Optional[str]:
        """Get full path to a report file."""
        filepath = os.path.join(REPORTS_DIR, filename)
        if os.path.exists(filepath):
            return filepath
        return None

    def clear_reports(self) -> int:
        """Clear all reports. Returns count cleared."""
        count = len(_reports)
        _reports.clear()
        return count


report_service = ReportService()
