export const apiKeySchema = {
    title:"API Key Auth",
    type: 'apiKey',
    in: 'header',
    name: "x-access-token"
}