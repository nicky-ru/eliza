import {
    type IAgentRuntime,
    type Provider,
    type Memory,
    type State,
    elizaLogger,
} from "@ai16z/eliza";

import type { DepinScanMetrics, DepinScanProject } from "../types/depin";

export const DEPIN_METRICS_URL =
    "https://gateway1.iotex.io/depinscan/explorer?is_latest=true";
export const DEPIN_PROJECTS_URL = "https://metrics-api.w3bstream.com/project";

export class DepinDataProvider {
    constructor() {}

    static fetchDepinscanMetrics = async (): Promise<DepinScanMetrics> => {
        const res = await fetch(DEPIN_METRICS_URL);
        return res.json();
    };
    static fetchDepinscanProjects = async (): Promise<DepinScanProject> => {
        const res = await fetch(DEPIN_PROJECTS_URL);
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
            const depinProjects =
                await DepinDataProvider.fetchDepinscanProjects();

            return `
                #### 📈 **Metrics Data**
                \`\`\`
                ${depinMetricsData}
                \`\`\`

                #### 🏗️ **Projects Data**
                \`\`\`
                ${JSON.stringify(depinProjects, (key, value) =>
                    typeof value === "bigint" ? value.toString() : value
                )}
                \`\`\`
            `;
        } catch (error) {
            elizaLogger.error("Error in DePIN data provider:", error);
            return null;
        }
    },
};
