"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queries = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.queries = {
    getHomesQuery: () => `{
      viewer {
        homes {
          id
          timeZone
          address {
            address1
            postalCode
            city
          }
          features {
            realTimeConsumptionEnabled
          }
          currentSubscription {
            status
          }
        }
        websocketSubscriptionUrl
      }
    }`,
    getHomeFeaturesByIdQuery: (homeId) => `{
      viewer {
        home(id:"${homeId}") {
          features {
            realTimeConsumptionEnabled
          }
        }
        websocketSubscriptionUrl
      }
    }`,
    getPriceQuery: (homeId) => `{
      viewer {
        home(id:"${homeId}") {
          currentSubscription {
            priceInfo {
              today {
                total
                energy
                tax
                startsAt
                level
              }
              tomorrow {
                total
                energy
                tax
                startsAt
                level
              }
            }
          }
        }
      }
    }`,
    getConsumptionQuery: (homeId, daysToFetch, hoursToFetch) => `{
      viewer {
        home(id:"${homeId}") {
          daily: consumption(resolution: DAILY, last: ${daysToFetch}) {
            nodes {
              from
              to
              totalCost
              unitCost
              unitPrice
              unitPriceVAT
              consumption
              consumptionUnit
            }
          },
          hourly: consumption(resolution: HOURLY, last: ${hoursToFetch}) {
            nodes {
              from
              to
              totalCost
              consumption
            }
          }
        }
      }
    }`,
    getPushMessage: (title, message) => `mutation{
      sendPushNotification(input: {
        title: "${title}",
          message: "${message}",
          screenToOpen: CONSUMPTION
      }){
        successful
        pushedToNumberOfDevices
      }
    }`,
    getSubscriptionQuery: (homeId) => (0, graphql_tag_1.default) `subscription{
      liveMeasurement(homeId:"${homeId}"){
        timestamp
        power
        accumulatedConsumption
        accumulatedCost
        currency
        minPower
        averagePower
        maxPower
        powerProduction
        currentL1
        currentL2
        currentL3
      }
    }`,
};
//# sourceMappingURL=queries.js.map