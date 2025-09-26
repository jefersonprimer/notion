import { useEffect, useState } from "react"
import { View, Text, FlatList, TouchableOpacity, Button } from "react-native"
import { supabase } from "@/lib/supabase"
import { useRouter } from "expo-router"
import { Note } from "@/types/note"

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchNotes()
  }, [])

  async function fetchNotes() {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      alert(error.message)
      return
    }

    setNotes(data as Note[])
  }

  function openNote(id: string) {
    router.push(`/note/${id}`)
  }

  return (
    <View className="flex-1 p-4">
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="border-b border-gray-300 p-3"
            onPress={() => openNote(item.id)}
          >
            <Text className="font-bold text-lg">{item.title}</Text>
            {item.description ? (
              <Text className="text-gray-600" numberOfLines={2}>
                {item.description}
              </Text>
            ) : null}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">
            No notes yet. Tap + to create one.
          </Text>
        }
      />

      {/* Botão para criar nova nota */}
      <View className="absolute bottom-6 right-6">
        <Button title="+" onPress={() => openNote("new")} />
      </View>
    </View>
  )
}

