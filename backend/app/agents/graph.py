from langgraph.graph import (
    StateGraph,
    END,
)

from app.agents.state import (
    ContentState,
)

from app.agents.nodes.research_node import (
    research_node,
)


builder = StateGraph(
    ContentState
)

builder.add_node(
    "research",
    research_node,
)

builder.set_entry_point(
    "research"
)

builder.add_edge(
    "research",
    END,
)

graph = builder.compile()