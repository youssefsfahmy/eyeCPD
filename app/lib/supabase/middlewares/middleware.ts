import { sessionMiddleware } from "./sessions";
import { authorizeMiddleware } from "./authorize";
import { NextRequest } from "next/server";
import type { SessionMiddlewareResult } from "./types";

export async function combinedMiddleware(request: NextRequest) {
  const sessionResult: SessionMiddlewareResult = await sessionMiddleware(
    request
  );
  const { response, user } = sessionResult;

  // check if the response is of type redirect or error or unauthorized
  if (
    response.status === 307 ||
    response.status === 302 ||
    response.status === 401 ||
    response.status === 403 ||
    request.nextUrl.pathname.startsWith("/.well-known") ||
    !user
  ) {
    return response;
  }

  const authorizeResponse = await authorizeMiddleware(request, user);
  return authorizeResponse;
}
