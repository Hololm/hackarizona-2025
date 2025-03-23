from pydantic import BaseModel


class StakeLogin(BaseModel):
    table_id: str
    session_id: str

class WebAppLogin(BaseModel):
    username: str
    password: str