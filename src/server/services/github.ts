import { Octokit } from "@octokit/rest";
import getConfig from "next/config";
import { FetchRequest, GithubEnv } from 'types/server/services/types';
import { CommitPayload } from "types/server/services/types";


const { publicRuntimeConfig } = getConfig();
const githubEnv = publicRuntimeConfig as GithubEnv;

class Client {

    commits = {
        fetchLatestCommits: async function({ count }: FetchRequest){

            const { GITHUB_PERSONAL_ACCESS_TOKEN, GITHUB_USERNAME } = githubEnv;

            const ocktokit = new Octokit({
                auth: GITHUB_PERSONAL_ACCESS_TOKEN
            });

            const { data } = await ocktokit.activity.listEventsForAuthenticatedUser({
                username: GITHUB_USERNAME,
                per_page: count as number
            });

            const events = data.filter((event: typeof data[0]) => event.type === "PushEvent")

            return {
                commits: events.map((commit: typeof events[0]) => {
                    
                    const payload = commit.payload as CommitPayload;

                    const headCommit = payload.commits.filter((repoCommit) => payload.head === repoCommit.sha).pop()

                    return {
                        avatarUrl: commit.actor.avatar_url,
                        repoName: commit.repo.name,
                        repoUrl: commit.repo.url,
                        message: headCommit?.message,
                        headCommitUrl: headCommit?.url
                    }
                })
            };

        }
    }
}


export const github = {
    Client
}