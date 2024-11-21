package com.yttrium

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import uniffi.yttrium.Endpoint

class YttriumModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }


  @ReactMethod
  fun Endpoint(promise: Promise){
      System.out.println("Hello from YttriumModule")
      System.out.println(Endpoint)
      var e = Endpoint(baseUrl = "https://yttrium.uniffi.com", apiKey = "YOUR_API_KEY")
      // log object in Xcode logs (open pressing Shift+Cmd+C)
      System.out.println(e)
      promise.resolve("Endpoint: " + e.baseUrl)
  }

@ReactMethod
  fun Address(promise: Promise){
      System.out.println("Hello from YttriumModule address")
      promise.resolve("Address: " + "123")
  }


  companion object {
    const val NAME = "Yttrium"
  }
}
