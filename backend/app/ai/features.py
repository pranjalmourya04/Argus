import random
import networkx as nx


def simulate_transactions(wallet: str, suspicious: bool = False, num_nodes: int = 25):
    """
    Simulate transaction network.
    If suspicious=True, generate anomalous behavior.
    """

    G = nx.DiGraph()
    G.add_node(wallet)

    if not suspicious:
        # NORMAL BEHAVIOR
        for i in range(num_nodes):
            counterparty = f"wallet_{i}"
            value = random.randint(10, 200)

            if random.random() > 0.5:
                G.add_edge(wallet, counterparty, value=value)
            else:
                G.add_edge(counterparty, wallet, value=value)

    else:
        # SUSPICIOUS BEHAVIOR
        # Few counterparties but extreme repeated volume
        for i in range(3):  # small counterparty pool
            counterparty = f"suspicious_wallet_{i}"

            for _ in range(20):  # burst behavior
                value = random.randint(2000, 8000)

                # Heavily skewed incoming
                if random.random() > 0.1:
                    G.add_edge(counterparty, wallet, value=value)
                else:
                    G.add_edge(wallet, counterparty, value=value)

    return G

    G = nx.DiGraph()

    G.add_node(wallet)

    # Generate synthetic counterparties
    for i in range(num_nodes):
        counterparty = f"wallet_{i}"

        # Randomly decide direction
        if random.random() > 0.5:
            G.add_edge(wallet, counterparty, value=random.randint(1, 100))
        else:
            G.add_edge(counterparty, wallet, value=random.randint(1, 100))

    return G


def extract_graph_features(G, wallet: str):

    total_transactions = G.degree(wallet)

    incoming_edges = G.in_edges(wallet, data=True)
    outgoing_edges = G.out_edges(wallet, data=True)

    incoming_count = len(incoming_edges)
    outgoing_count = len(outgoing_edges)

    incoming_volume = sum(data["value"] for _, _, data in incoming_edges)
    outgoing_volume = sum(data["value"] for _, _, data in outgoing_edges)

    total_volume = incoming_volume + outgoing_volume

    incoming_outgoing_ratio = incoming_count / (outgoing_count + 1)

    unique_counterparties = len(set(
        list(G.predecessors(wallet)) +
        list(G.successors(wallet))
    ))

    degree_centrality = nx.degree_centrality(G).get(wallet, 0)
    clustering = nx.clustering(G.to_undirected()).get(wallet, 0)

    return {
        "total_transactions": total_transactions,
        "unique_counterparties": unique_counterparties,
        "incoming_count": incoming_count,
        "outgoing_count": outgoing_count,
        "incoming_outgoing_ratio": incoming_outgoing_ratio,
        "total_volume": total_volume,
        "degree_centrality": degree_centrality,
        "clustering_coefficient": clustering
    }

