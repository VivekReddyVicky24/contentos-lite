from langgraph.graph import (
    END,
    StateGraph,
)

from app.agents.state import (
    ContentState,
)

from app.agents.nodes.research_node import (
    research_node,
)

from app.agents.nodes.planner_node import (
    planner_node,
)

from app.agents.nodes.seo_node import (
    seo_node,
)
from app.agents.nodes.writer_node import (
    writer_node,
)
from app.agents.nodes.editor_node import (
    editor_node,
)
from app.agents.nodes.approval_node import (
    approval_node,
)


builder = StateGraph(
    ContentState
)

builder.add_node(
    "research",
    research_node,
)

builder.add_node(
    "planner",
    planner_node,
)

builder.add_node(
    "seo",
    seo_node,
)

builder.add_node(
    "writer",
    writer_node,
)
builder.add_node(
    "editor",
    editor_node,
)
builder.add_node(
    "approval",
    approval_node,
)


builder.set_entry_point(
    "research"
)


builder.add_edge(
    "research",
    "planner",
)

builder.add_edge(
    "planner",
    "seo",
)

builder.add_edge(
    "seo",
    "writer",
)

builder.add_edge(
    "writer",
    "editor",
)

builder.add_edge(
    "editor",
    "approval",
)

builder.add_edge(
    "approval",
    END,
)



graph = builder.compile()