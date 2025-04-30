import { NextRequest } from "next/server";

function router(req: NextRequest) {
  return Response.json(
    {
      code: 404,
      message: "Not found",
    },
    {
      status: 404,
    },
  );
}

export {
  router as GET,
  router as POST,
  router as PUT,
  router as DELETE,
  router as PATCH,
  router as HEAD,
  router as OPTIONS,
};
