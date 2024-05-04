export const getJSONResponse = (data: object, status = 200) =>
  new Response(JSON.stringify(data), {
    headers: {
      "Contentent-Type": "application/json",
    },
    status: status,
  });
