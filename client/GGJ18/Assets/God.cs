using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class God : MonoBehaviour {
	public static God instance;
	public string roomCode;
	Action<ReceivedPayloadCreate> onRoomCreated = null;
	private WebSocket w;
	void Awake () {
		if (!instance) {
			instance = this;
			DontDestroyOnLoad(gameObject);
		} else {
			Destroy(gameObject);
		}
	}

	IEnumerator Start() {
		w = new WebSocket(new Uri("ws://localhost:8999"));
		yield return StartCoroutine(w.Connect());
		while (true)
		{
			string message = w.RecvString();
			if (message != null)
			{
				var messageGeneric = JsonUtility.FromJson<Message>(message);
				if (messageGeneric.type == "create") {
					var msg = JsonUtility.FromJson<ReceivedMessageCreate>(message);
					if (onRoomCreated != null) {
						onRoomCreated(msg.payload);
					}
				}
			}
			yield return 0;
		}
		w.Close();
	}

	public void CreateGame(string name, Action<ReceivedPayloadCreate> onRoomCreated) {
		this.onRoomCreated = onRoomCreated;
		w.SendString(
			JsonUtility.ToJson(
				new SentMessageCreate{
					type = "create",
					payload = new SentPayloadCreate{name = name}}));
	}
}
