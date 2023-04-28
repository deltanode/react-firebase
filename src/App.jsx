import { useState, useEffect } from "react"
import { AiOutlinePlus } from "react-icons/ai"
import Todo from "./components/Todo"
import { db } from "./firebase"
import { query, collection, onSnapshot, updateDoc, doc } from "firebase/firestore"

const style = {
  bg: `h-screen w-screen p-4 bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]`,
  container: `bg-slate-100 max-w-[500px] w-full m-auto rounded-md shadow-xl p-4`,
  heading: `text-3xl font-bold text-center text-gray-800`,
  form: `flex justify-between`,
  input: `border p-2 w-full text-xl`,
  button: `border p-4 ml-2 bg-purple-500 text-slate-100`,
  count: `text-center p-2`
}

function App() {
  const [todos, setTodos] = useState([])
  // console.log("todos: ", todos[0])

  // Create todo
  // Read todo from firebase
  useEffect(() => {
    const q = query(collection(db, "todos"))

    const unSubscribe = onSnapshot(q, querySnapshot => {
      let todoArr = []
      querySnapshot.forEach(doc => {
        todoArr.push({ ...doc.data(), id: doc.id })
      })
      setTodos(todoArr)
    })

    return () => unSubscribe
  }, [])

  // Update todo from firebase
  const toggleComplete = async todo => {
    await updateDoc(doc(db, "todos", todo.id), {
      isCompleted: !todo.isCompleted
    })
  }

  // Delete todo from firebase

  return (
    <div className={style.bg}>
      <div className={style.container}>
        <h3 className={style.heading}>Todo App</h3>
        <form className={style.form}>
          <input className={style.input} type="text" placeholder="Add Todo" />
          <button className={style.button}>
            <AiOutlinePlus size={30} />
          </button>
        </form>
        <ul>
          {todos.map((todo, index) => {
            return <Todo key={index} todo={todo} toggleComplete={toggleComplete} />
          })}
        </ul>
        <p className={style.count}>You have 2 todos</p>
      </div>
    </div>
  )
}

export default App
