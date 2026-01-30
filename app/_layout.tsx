import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Audio } from 'expo-av';
import { Asset } from 'expo-asset';

// 1. USE ONE OF YOUR "BAD" VIDEOS HERE
// (Ideally, upload one of your AI videos to a public link and paste it here)
// For now, I am using a standard test video, but YOU should change this 
// if the bug is specific to your file type.
const VIDEO_SOURCE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'; 

// 2. A SHORT SOUND EFFECT (Mimics your "Unlock" sound)
const SOUND_SOURCE = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export default function App() {
  // Setup the Video Player (Simulating your Feed)
  const player = useVideoPlayer(VIDEO_SOURCE, player => {
    player.loop = true;
    player.play();
  });

  const [status, setStatus] = useState('Playing Video...');

  // The "Bug Trigger" Function
  const triggerConflict = async () => {
    setStatus('Attempting Audio Interruption...');
    
    try {
      // This mimics your "Unlock Screen" logic
      // 1. We start a sound using the OLD architecture (expo-av)
      console.log('Loading Sound...');
      const { sound } = await Audio.Sound.createAsync(
        { uri: SOUND_SOURCE }
      );
      
      console.log('Playing Sound...');
      // This Request for Audio Focus is what likely kills the Video Player
      await sound.playAsync();

      setStatus('Audio Playing... Did Video Freeze?');
    } catch (e) {
      console.error(e);
      setStatus('Error Triggering Audio');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Freeze Repro</Text>
      <Text style={styles.subtitle}>{status}</Text>

      <View style={styles.videoContainer}>
        <VideoView 
          style={styles.video} 
          player={player} 
          nativeControls={false} // mimicking your "feed" style
        />
      </View>

      <View style={styles.controls}>
        <Button 
          title="TRIGGER DEADLOCK (Play Audio)" 
          color="red"
          onPress={triggerConflict} 
        />
        <Text style={styles.hint}>
          Tap this button while video is playing to simulate the crash.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20, color: 'blue' },
  videoContainer: {
    width: 300,
    height: 500,
    backgroundColor: '#000',
    marginBottom: 20,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  controls: {
    gap: 10,
    alignItems: 'center',
  },
  hint: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
  }
});