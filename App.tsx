import React, { useEffect, useRef, useState } from 'react';
import { Text, View, FlatList, ActivityIndicator, Alert, Switch, RefreshControl, Button } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MovieCard, { Movie } from './components/MovieCard';

const API = 'https://6ac33a90ae53bf25b80e2a7c.mockapi.io/VD1/Resourcemovies';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);
  const [isTile, setIsTile] = useState(false);
  const n = isTile ? 2 : 1;
  const page = useRef(1);
  const busy = useRef(false);

  const load = async (p: number, replace = false) => {
    if (busy.current) return;
    busy.current = true;
    setLoading(true); setError(false);
    try {
      const res = await fetch(`${API}?page=${p}&limit=10`);
      const data: Movie[] = res.status === 404 ? [] : await res.json();
      setMovies(prev => {
        const base = replace ? [] : prev;
        const ids = new Set(base.map(m => m.id));
        return [...base, ...data.filter(m => !ids.has(m.id))];
      });
      page.current = p + 1;
      setHasMore(data.length === 10);
    } catch {
      setError(true);
    } finally {
      busy.current = false; setLoading(false); setRefreshing(false);
    }
  };

  useEffect(() => { load(1, true); }, []);

  const onSelect = (id: string) => {
    const m = movies.find(x => x.id === id);
    if (m) Alert.alert(`${m.title} (${m.year})`);
  };

  const Footer = () =>
    loading && movies.length ? <ActivityIndicator style={{ padding: 16 }} /> :
    error ? (
      <View style={{ padding: 16, alignItems: 'center' }}>
        <Text>Tải thất bại</Text>
        <Button title="Thử lại" onPress={() => load(page.current, page.current === 1)} />
      </View>
    ) :
    !hasMore && movies.length ? <Text style={{ textAlign: 'center', padding: 16 }}>— Đã hết danh sách —</Text> : null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
        <View style={{ padding: 12, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center' }}>Movie App</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Text>Dạng lưới </Text>
            <Switch value={isTile} onValueChange={setIsTile} />
          </View>
        </View>
        {loading && !movies.length ? <ActivityIndicator size="large" style={{ marginTop: 40 }} /> : (
          <FlatList
            key={String(n)}
            data={movies}
            keyExtractor={i => i.id}
            numColumns={n}
            columnWrapperStyle={isTile ? { justifyContent: 'space-between' } : undefined}
            contentContainerStyle={{ padding: 10 }}
            renderItem={({ item }) => <MovieCard movie={item} layout={isTile ? 'tile' : 'row'} onSelect={onSelect} />}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); busy.current = false; load(1, true); }} />}
            onEndReached={() => hasMore && !error && load(page.current)}
            onEndReachedThreshold={0.5}
            ListFooterComponent={Footer}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}