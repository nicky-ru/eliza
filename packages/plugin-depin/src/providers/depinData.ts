import {
    type IAgentRuntime,
    type Provider,
    type Memory,
    type State,
    elizaLogger,
} from "@ai16z/eliza";

import type { DepinScanMetrics } from "../types/depin";

const DEPIN_METRICS_URL =
    "https://gateway1.iotex.io/depinscan/explorer?is_latest=true";

export class DepinDataProvider {
    constructor() {}

    static fetchDepinscanMetrics = async (): Promise<DepinScanMetrics> => {
        const res = await fetch(DEPIN_METRICS_URL);
        return res.json();
    };
}

export const depinDataProvider: Provider = {
    async get(
        _runtime: IAgentRuntime,
        _message: Memory,
        _state?: State
    ): Promise<string | null> {
        try {
            const depinMetricsData =
                await DepinDataProvider.fetchDepinscanMetrics();

            return JSON.stringify(depinMetricsData);
        } catch (error) {
            elizaLogger.error("Error in DePIN data provider:", error);
            return null;
        }
    },
};
