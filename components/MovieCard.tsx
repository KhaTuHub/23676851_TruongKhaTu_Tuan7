import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export type Movie = {
  id: string;
  title: string;
  genre: string;
  year: number;
  rating: number;
  poster: string;
  isWatched: boolean;
};

type MovieCardProps = {
  movie: Movie;
  layout?: 'row' | 'tile';
  onSelect: (id: string) => void;
};

function MovieCard({ movie, layout = 'row', onSelect }: MovieCardProps) {
  const isTile = layout === 'tile';
  const rating = `⭐ ${Number(movie.rating).toFixed(1)}`;
  const status = movie.isWatched ? '✅' : '⏳';

  return (
    <TouchableOpacity
      style={[styles.card, isTile && styles.cardTile]}
      onPress={() => onSelect(movie.id)}
    >
      <View>
        <Image
          source={{ uri: movie.poster }}
          style={isTile ? styles.posterTile : styles.poster}
        />
        {isTile && <Text style={styles.badge}>{rating}</Text>}
      </View>

      <View style={isTile ? styles.infoTile : styles.info}>
        <Text style={styles.title} numberOfLines={isTile ? 1 : 2}>
          {movie.title}
        </Text>
        {!isTile && <Text style={styles.sub}>{movie.genre}</Text>}
        {!isTile && <Text style={styles.sub}>{movie.year}</Text>}
        {!isTile && <Text style={styles.sub}>{rating}</Text>}
        <Text style={styles.sub}>{status}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', width: '100%', backgroundColor: '#fff', borderRadius: 8, padding: 8, marginBottom: 10 },
  cardTile: { flexDirection: 'column', width: '48%', padding: 0, overflow: 'hidden' },
  poster: { width: 70, height: 100, borderRadius: 6, backgroundColor: '#ddd' },
  posterTile: { width: '100%', aspectRatio: 2 / 3, backgroundColor: '#ddd' },
  badge: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, fontSize: 12 },
  info: { flex: 1, marginLeft: 10, justifyContent: 'center' },
  infoTile: { padding: 8 },
  title: { fontSize: 15, fontWeight: 'bold' },
  sub: { fontSize: 13, color: '#555', marginTop: 2 },
});

export default React.memo(MovieCard);