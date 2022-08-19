import qql from "graphql-tag";

export const createRouteQuery = qql`
mutation newRoute{
    newRoute(
      input: {
        ev: {
          id: "5d161be5c9eef46132d9d20a"
          plugs: { chargingPower: 150, standard: TESLA_S }
          adapters: [
            { chargingPower: 150, standard: IEC_62196_T2_COMBO }
            { chargingPower: 150, standard: CHADEMO }
          ]
          climate: true
          numberOfPassengers: 1
        }
        routeRequest: {
          origin: {
            type: Feature
            geometry: { type: Point, coordinates: [9.732625731357011, 52.3806314590276] }
            properties: { name: "Hanover, Germany" }
          }
          destination: {
            type: Feature
            geometry: { type: Point, coordinates: [9.922192327081783, 57.046057998779176] }
            properties: { name: "Aalborg, Denmark" }
          }
        }
      }
    )
  }
`;

export const routeUpdateSubscription = qql`
subscription routeUpdatedById($id: ID!){
  routeUpdatedById(id: $id) {
    status
    route {
      charges
      saving {
        money
        co2
      }
      chargeTime
      distance
      duration
      consumption
      polyline
      legs{
        chargeTime
        origin{
          geometry{
            type
            coordinates
          }
          properties
        }
        destination{
          geometry
          {
            type
            coordinates
          }
          properties
        }
      }
    }
  }
}
`;
