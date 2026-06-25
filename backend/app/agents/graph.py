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

builder.set_entry_point(
    "research"
)

builder.add_edge(
    "research",
    "planner",
)

builder.add_edge(
    "planner",
    END,
)

graph = builder.compile()