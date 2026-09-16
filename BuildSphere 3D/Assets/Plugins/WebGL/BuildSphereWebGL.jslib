mergeInto(LibraryManager.library, {
  SendToReact: function (eventNamePtr, payloadJsonPtr) {
    var eventName = UTF8ToString(eventNamePtr);
    var payloadJson = UTF8ToString(payloadJsonPtr);
    try {
      if (typeof window !== "undefined" && typeof window.dispatchReactUnityEvent === "function") {
        window.dispatchReactUnityEvent(eventName, payloadJson);
      } else {
        console.log("[BuildSphere WebGL -> React]", eventName, payloadJson);
      }
    } catch (e) {
      console.error("[BuildSphere WebGL Bridge Error]", e);
    }
  }
});
