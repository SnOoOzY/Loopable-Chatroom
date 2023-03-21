import logo from './logo.svg';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyBkD9iTuqLCuhaQDcQe-fLFdupzoMQuv48",
    authDomain: "loopable-41c09.firebaseapp.com",
    projectId: "loopable-41c09",
    storageBucket: "loopable-41c09.appspot.com",
    messagingSenderId: "683931012251",
    appId: "1:683931012251:web:bfe07a1f915f6cd01eca3e",
    measurementId: "G-1P16GNW6B3"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


const [user] = useAuthState(auth);
  <div className="App">
    <header>

    </header>

    <section>
      {user ? <ChatRoom /> : <SignIn />}
    </section>
  </div>


function SignIn() {
    const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthPovider();
      auth.signInWithPopup(provider);
  }
    return (
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    )


}

function SignOut() {
  return auth.currentUser && (

    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  
  const dummy = useRef()

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {

      e.preventDefault();

      const {uid, photoURL} = auth.currentUser;

      await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL
      })

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth' });

  }

    return (
      <>
        <main>
          {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

            <div ref={dummy}></div>

        </main>
        
        <form onSubmit={sendMessage}>

            <input value={formValue} onChange={(e) => setFormValue(e.target.value)} >
            
              <button type="submit"> </button>

            </input>


        </form>
        
        </>
    )
}

function ChatMessage(props) {

    const {text, uid, photoURL} = props.message;

    const messageClass = uid === auth.currentUser.uid ? 'send' : 'recieved';

    return(
      <div className={'message ${messageClass}'}>
        <img src={photoURL}></img>
        <p>{text}</p>

      </div>
    )

}


function App() {
  return (
    <div className="App">
      <header className="App-header">
  
      </header>
    </div>
  );
}

export default App;
