import { createFileRoute } from "@tanstack/react-router";

import { handleProxy } from "../lib/site-proxy";

const handler = ({ request }: { request: Request }) => handleProxy(request);

export const Route = createFileRoute("/")({
  server: {
    handlers: {
      GET: handler,
      HEAD: handler,
      POST: handler,
      PUT: handler,
      PATCH: handler,
      DELETE: handler,
      OPTIONS: handler,
    },
  },
});
