def generate_explanation(features, risk_score):
    """
    Generate severity-aware explanations
    """

    explanations = []

    # Only give strong explanations if risk is moderate or high
    if risk_score >= 55:

        if features["incoming_outgoing_ratio"] > 1.8:
            explanations.append("High incoming/outgoing imbalance detected")

        if features["total_volume"] > 6000:
            explanations.append("Abnormally high transaction volume")

        if features["unique_counterparties"] < 4:
            explanations.append("Concentrated transactions among few counterparties")

        if features["clustering_coefficient"] > 0.5:
            explanations.append("Dense transaction clustering pattern")

    elif risk_score >= 45:

        if features["incoming_outgoing_ratio"] > 1.5:
            explanations.append("Moderate transaction imbalance")

        if features["total_volume"] > 4000:
            explanations.append("Elevated transaction volume")

    else:
        explanations.append("Transaction behavior within expected range")

    return explanations
