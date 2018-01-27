using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class CreateGameButtonScript : MonoBehaviour {
	public Button button;
	public InputField nameInput;
	public Text roomCode;
	// Use this for initialization
	void Start () {
		button.onClick.AddListener(OnButtonClick);
	}
	
	// Update is called once per frame
	void OnButtonClick () {
		God.instance.CreateGame(nameInput.text, payload => {
			roomCode.text = payload.roomCode;
			Debug.Log(payload.roomCode);
		});
	}
}
