import React, { useState, useEffect, useCallback } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, TextInput, View, YellowBox, Button } from 'react-native'
import { initializeApp } from '@firebase/app';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAn_k8IUf7f74MJaUfYjGjgmrTKyXgYcQE",
  authDomain: "chat-firebase-rn-one.firebaseapp.com",
  projectId: "chat-firebase-rn-one",
  storageBucket: "chat-firebase-rn-one.appspot.com",
  messagingSenderId: "510546791618",
  appId: "1:510546791618:web:108cd47b1d91f36a5a7f5b",
  measurementId: "G-4WW054DQP2"
};

// if (!initializeApp.apps.length) {
//   initializeApp(firebaseConfig);
// }

const app = initializeApp(firebaseConfig);


import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer for a long period of time']);

import { getFirestore, collection, getDocs,onSnapshot  } from '@firebase/firestore';

const db = getFirestore();
const chatsRef = collection(db, 'chats');

export default function App() {
    const [user, setUser] = useState(null)
    const [name, setName] = useState('')
    const [messages, setMessages] = useState([])

    console.log(chatsRef);

    useEffect(() => {
        readUser()
        const unsubscribe = onSnapshot(chatsRef, (querySnapshot) => {
            const messagesFirestore = querySnapshot
            .docChanges()
            .filter(({ type }) => type === 'added')
            .map(({ doc }) => {
                const message = doc.data()
                    return { ...message, createdAt: message.createdAt.toDate() }
                })
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                appendMessages(messagesFirestore)
            });
            return () => unsubscribe()
        }, [])

    const appendMessages = useCallback(
        (messages) => {
            setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
        },
        [messages]
    )

    async function readUser() {
        const user = await AsyncStorage.getItem('user')
        if (user) {
            setUser(JSON.parse(user))
        }
    }
    async function handlePress() {
        const _id = Math.random().toString(36).substring(7)
        const user = { _id, name }
        await AsyncStorage.setItem('user', JSON.stringify(user))
        setUser(user)
    }
    async function handleSend(messages) {
        const writes = messages.map((m) => chatsRef.add(m))
        await Promise.all(writes)
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <TextInput style={styles.input} placeholder="Enter your name" value={name} onChangeText={setName} />
                <Button onPress={handlePress} title="Enter the chat" />
            </View>
        )
    }
    return <GiftedChat messages={messages} user={user} onSend={handleSend} />
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    input: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        padding: 15,
        marginBottom: 20,
        borderColor: 'gray',
    },
})

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAn_k8IUf7f74MJaUfYjGjgmrTKyXgYcQE",
//   authDomain: "chat-firebase-rn-one.firebaseapp.com",
//   projectId: "chat-firebase-rn-one",
//   storageBucket: "chat-firebase-rn-one.appspot.com",
//   messagingSenderId: "510546791618",
//   appId: "1:510546791618:web:108cd47b1d91f36a5a7f5b",
//   measurementId: "G-4WW054DQP2"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
