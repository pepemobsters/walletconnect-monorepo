import YttriumWrapper


@objc(Yttrium)
class Yttrium: NSObject {
  
  @objc
  func checkStatus(_ params: Any, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    print("checkStatus called with", params )
    if let dict = params as? [String: Any],
       let projectId = dict["projectId"] as? String,
       let orchestrationId = dict["orchestrationId"] as? String {
      let client = ChainAbstractionClient.init(projectId: projectId)
      Task {
        do {
          let statusResponse = try await client.status(orchestrationId: orchestrationId)
          
          switch statusResponse {
          case let .completed(statusResponseCompleted):
            print("status response completed", statusResponseCompleted)
            let responseDict: [String: Any] = [
              "createdAt": statusResponseCompleted.createdAt,
              "status": "completed"
            ]
            resolve(responseDict)
          case let .error(statusResponseError):
            print("status response error", statusResponseError)
            let responseDict: [String: Any] = [
                "createdAt": statusResponseError.createdAt,
                "reason": statusResponseError.error,
                "status": "error"
            ]
            resolve(responseDict)
          case let .pending(statusResponsePending):
            print("status response pending", statusResponsePending)
            let responseDict: [String: Any] = [
              "createdAt": statusResponsePending.createdAt,
              "checkIn": statusResponsePending.checkIn,
              "status": "pending"
            ]
            resolve(responseDict)
          }
        } catch {
          print("Error occurred: \(error)")
          print(error)
          reject("checkStatus err", "checkStatus", error)
        }
      }
    }
  }
  
  func availableResponseToDictionary(_ response: YttriumWrapper.RouteResponseAvailable) -> [String: Any] {
    return [
      "orchestrationId": response.orchestrationId,
      "transactions": response.transactions.map { transaction in
        return [
          "from": transaction.from,
          "to": transaction.to,
          "value": transaction.value,
          "gas": transaction.gas,
          "data": transaction.data,
          "nonce": transaction.nonce,
          "chainId": transaction.chainId,
          "gasPrice": transaction.gasPrice,
          "maxFeePerGas": transaction.maxFeePerGas,
          "maxPriorityFeePerGas": transaction.maxPriorityFeePerGas,
        ]
      },
      "metadata": [
        "fundingFrom": response.metadata.fundingFrom.map { funding in
          return [
            "chainId": funding.chainId,
            "tokenContract": funding.tokenContract,
            "symbol": funding.symbol,
            "amount": funding.amount,
          ]
        }
      ],
      "checkIn": response.metadata.checkIn,
    ]
  }
  
  @objc
  func checkRoute(_ params: Any, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    print("checkRoute called with", params)
    if let dict = params as? [String: Any],
       let transactionData = dict["transaction"] as? [String: Any],
       let from = transactionData["from"] as? FfiAddress,
       let chainId = transactionData["chainId"] as? String,
       let data = transactionData["data"] as? FfiBytes,
       let gasPrice = transactionData["gasPrice"] as? String,
       let gas = transactionData["gas"] as? Ffiu64,
       let value = transactionData["value"] as? Ffiu256,
       let to = transactionData["to"] as? FfiAddress,
       let maxFeePerGas = transactionData["maxFeePerGas"] as? Ffiu256,
       let maxPriorityFeePerGas = transactionData["maxPriorityFeePerGas"] as? Ffiu256,
       let nonce = transactionData["nonce"] as? Ffiu64,
       let projectId = dict["projectId"] as? String {
      
      
      let client = ChainAbstractionClient.init(projectId: projectId)
      print("created client, checking route...")
      Task {
        do {
          let transaction = InitTransaction.init(from: from, to: to, value: value, gas: gas, gasPrice: gasPrice, data: data, nonce: nonce, maxFeePerGas: maxFeePerGas, maxPriorityFeePerGas: maxPriorityFeePerGas, chainId: chainId)
          
          let routeResponseSuccess = try await client.route(transaction: transaction)
          print("result", routeResponseSuccess)
          
          switch routeResponseSuccess {
          case let .success(routeResponse):
            switch routeResponse {
            case let .available(availableResponse):
              let responseDict = availableResponseToDictionary(availableResponse)
              resolve(["status": "available", "data": responseDict])
            case .notRequired(_):
              print("not required")
              resolve(["status": "not_required"])
            }
          case let .error(routeResponse):
            switch routeResponse.error {
            case BridgingError.insufficientFunds:
              let responseDict: [String: Any] = [
                "status": "error",
                "reason": "insufficientFunds"
              ]
              resolve(responseDict)
            case BridgingError.insufficientGasFunds:
              let responseDict: [String: Any] = [
                "status": "error",
                "reason": "insufficientGasFunds"
              ]
              resolve(responseDict)
            case BridgingError.noRoutesAvailable:
              let responseDict: [String: Any] = [
                "status": true,
                "reason": "noRoutesAvailable"
              ]
              resolve(responseDict)
            }
            print(routeResponse)
            print(routeResponse.error)
          }
          //          resolve(result)
        } catch {
          print("Error occurred: \(error)")
          print(error)
          reject("yttrium err", "yttrium_err", error)
        }
      }
    }
    
  }
}
