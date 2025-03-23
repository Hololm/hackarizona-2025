from __future__ import annotations
import json
from dataclasses import dataclass, asdict
from typing import TYPE_CHECKING


if TYPE_CHECKING:
    from _typeshed import DataclassInstance

def serialize_non_serializable(obj):
    if hasattr(obj, '__dict__'):  # Check if obj is a dataclass or similar
        return asdict(obj)
    elif isinstance(obj, (list, tuple)):  # Handle lists and tuples
        return [serialize_non_serializable(item) for item in obj]
    elif isinstance(obj, dict):  # Handle dictionaries
        return {key: serialize_non_serializable(value) for key, value in obj.items()}
    else:
        raise TypeError(f"Cannot serialize {obj!r}")

def dataclass_to_json(data: DataclassInstance) -> str:
    data_dict = asdict(data)
    # Recursively serialize non-serializable fields
    serialized_data = serialize_non_serializable(data_dict)
    return json.dumps(serialized_data)
