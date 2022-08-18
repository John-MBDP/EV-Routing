import {
  createClient,
  createRequest,
  defaultExchanges,
  subscriptionExchange,
} from "@urql/core";

import { SubscriptionClient } from "subscriptions-transport-ws";

const headers = {
  "x-client-id": process.env.REACT_APP_CLIENT_ID,
  "x-app-id": process.env.REACT_APP_ID,
};

const subscriptionClient = new SubscriptionClient(
  "wss://api.chargetrip.io/graphql",
  {
    reconnect: true,
    connectionParams: headers,
  }
);

const client = createClient({
  url: "https://api.chargetrip.io/graphql",
  fetchOptions: {
    method: "POST",
    headers,
  },
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription(operation) {
        return subscriptionClient.request(operation);
      },
    }),
  ],
});

export const getRoute = (callback) => {
  client
    .mutation(createRouteQuery)
    .toPromise()
    .then((response) => {
      const routeId = response.data.newRoute;
      if (!routeId)
        return Promise.reject(
          "Could not retrieve Route ID. The response is not valid."
        );

      const { unsubscribe } = pipe(
        client.executeSubscription(
          createRequest(routeUpdateSubscription, {
            id: routeId,
          })
        ),
        subscribe((result) => {
          const { status, route } =
            result.data.routeUpdatedById;

          // you can keep listening to the route changes to update route information
          // for this example we want to only draw the initial route
          if (status === "done" && route) {
            unsubscribe();
            callback(route);
          }
        })
      );
    })
    .catch((error) => console.log(error));
};
