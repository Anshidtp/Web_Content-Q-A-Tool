from pydantic import BaseModel, Field

class DocPage(BaseModel):
    title: str = Field(description="Page title")
    content: str = Field(description="Main content of the page")
    url: str = Field(description="Page URL")