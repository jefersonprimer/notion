import { useEffect, useState } from "react"
import { View, TextInput, Button } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { supabase } from "@/lib/supabase"

export default function NoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (id && id !== "new") {
      fetchNote()
    }
  }, [id])

  async function fetchNote() {
    const { data, error } = await supabase.from("notes").select("*").eq("id", id).single()
    if (error) {
      alert(error.message)
      return
    }
    setTitle(data.title)
    setDescription(data.description)
  }

  async function saveNote() {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return alert("You must be logged in")

    if (id === "new") {
      // create
      const { error } = await supabase.from("notes").insert([
        { title, description, user_id: user.id },
      ])
      if (error) return alert(error.message)
    } else {
      // update
      const { error } = await supabase.from("notes").update({
        title,
        description,
      }).eq("id", id)
      if (error) return alert(error.message)
    }

    router.back() // go back to home
  }

  return (
    <View className="flex-1 gap-4 p-4">
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        className="border p-2 rounded text-lg font-bold"
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        className="border p-2 rounded h-48"
        multiline
      />
      <Button title="Save" onPress={saveNote} />
    </View>
  )
}

