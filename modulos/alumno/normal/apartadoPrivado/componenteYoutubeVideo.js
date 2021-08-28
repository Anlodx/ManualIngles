import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  SafeAreaView,
  Text,
  FlatList,
  Image,
  View,
  TouchableOpacity,
  Modal,
  Dimensions,
  AppState
} from "react-native";
import YoutubeIframe, { getYoutubeMeta } from "react-native-youtube-iframe";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WebView from "react-native-webview";
const videoSeries = [
  "DC471a9qrU4",
  "tVCYa_bnITg",
  "K74l26pE4YA",
  "m3OjWNFREJo",
];

const VideoYT = ({videoId})=>{
  const [fondo,setFondo] = useState(AppState.currentState)
  const [mostrarVideo,setMostrarVideo] = useState(false)
  useEffect(()=>{
    AppState.addEventListener('change', handleAppStateChange);
    return ()=>AppState.removeEventListener('change', handleAppStateChange);
  },[]);

  const handleAppStateChange = (nextAppState) => {
     setFondo(nextAppState);
 }


  return(
<>
    {fondo == 'active' ?


            <>
            {
              mostrarVideo ?
              <YoutubeIframe
                play={false}
                videoId={"DC471a9qrU4"}
                height={250}
              />
              :
              <VideoItem videoId={"DC471a9qrU4"} onPress={()=>setMostrarVideo(true)}/>

            }
              </>




              :
              null

     }
</>
  )
}
export default VideoYT;

const VideoItem = ({ videoId, onPress }) => {
  const [videoMeta, setVideoMeta] = useState(null);
  useEffect(() => {
    getYoutubeMeta(videoId).then((data) => {
      setVideoMeta(data);
    });
  }, [videoId]);

  if (videoMeta) {
    return (
      <TouchableOpacity
        onPress={() => onPress()}
        style={{ flexDirection: "row", marginVertical: 16 }}
      >
        <Image
          source={{ uri: videoMeta.thumbnail_url }}
          style={{
            width: videoMeta.thumbnail_width / 4,
            height: videoMeta.thumbnail_height / 4,
          }}
        />
        <View style={{ justifyContent: "center", marginStart: 16 }}>
          <Text style={{ marginVertical: 4, fontWeight: "bold" }}>
            {videoMeta.title}
          </Text>
          <Text>{videoMeta.author_name}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  return null;
};


/*
const App = ({videoId}) => {
  const [modalVisible, showModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [progress, setProgress] = useState(0);

  const onVideoPress = useCallback((videoId) => {
    showModal(true);
    setSelectedVideo(videoId);
  }, []);

  useEffect(() => {
    getProgress().then((p) => {
      setProgress(p);
    });
  }, [modalVisible]);

  const closeModal = useCallback(() => showModal(false), []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VideoItem videoId={videoId} onPress={onVideoPress} />
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeModal}
      >
        <VideoModal videoId={selectedVideo} onClose={closeModal} />
      </Modal>
    </SafeAreaView>
  );
};

const getProgress = async () => {
  const total = videoSeries.length;
  let completed = 0;
  for (let i = 0; i < total; i++) {
    const videoId = videoSeries[i];
    const status = await getVideoProgress(videoId);
    if (status?.completed) {
      completed += 1;
    }
  }
  return completed / total;
};

const ProgressBar = ({ progress }) => {
  const width = (progress || 0) + "%";
  return (
    <View style={{ borderWidth: 1, marginVertical: 16 }}>
      <View
        style={{
          backgroundColor: "green",
          height: 10,
          width,
        }}
      />
    </View>
  );
};

const VideoItem = ({ videoId, onPress }) => {
  const [videoMeta, setVideoMeta] = useState(null);
  useEffect(() => {
    getYoutubeMeta(videoId).then((data) => {
      setVideoMeta(data);
    });
  }, [videoId]);

  if (videoMeta) {
    return (
      <TouchableOpacity
        onPress={() => onPress(videoId)}
        style={{ flexDirection: "row", marginVertical: 16 }}
      >
        <Image
          source={{ uri: videoMeta.thumbnail_url }}
          style={{
            width: videoMeta.thumbnail_width / 4,
            height: videoMeta.thumbnail_height / 4,
          }}
        />
        <View style={{ justifyContent: "center", marginStart: 16 }}>
          <Text style={{ marginVertical: 4, fontWeight: "bold" }}>
            {videoMeta.title}
          </Text>
          <Text>{videoMeta.author_name}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  return null;
};

const VideoModal = ({ videoId, onClose }) => {
  const playerRef = useRef(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      playerRef.current?.getCurrentTime().then((data) => {
        saveVideoProgress({
          videoId,
          completed,
          timeStamp: data,
        });
      });
    }, 2000);

    return () => {
      clearInterval(timer);
    };
  }, [videoId, completed]);

  const onPlayerReady = useCallback(() => {
    getVideoProgress(videoId).then((data) => {
      if (data.timeStamp) {
        playerRef.current?.seekTo(data.timeStamp);
      }
    });
  }, [videoId]);

  return (

      <View style={{ backgroundColor: "blue",width: Dimensions.get("window").width,height: Dimensions.get("window").height,zIndex: -10}}>

        <YoutubeIframe
          ref={playerRef}
          play={true}
          videoId={videoId}
          //width={Dimensions.get("window").width}
          height={250}

          webViewStyle={{backgroundColor: "red",width: Dimensions.get("window").width,height: Dimensions.get("window").height,zIndex: 2}}
          webViewProps={{
            onLoadEnd:() => {
            console.log("hola amigo")
          },
          containerStyle:{ backgroundColor:"yellow" }
          }}

          onReady={onPlayerReady}

          onChangeState={(state) => {
            if (state === "ended") {
              setCompleted(true);
            }
          }}
        />
      </View>

  );
};

const saveVideoProgress = ({ videoId, completed, timeStamp }) => {
  const data = {
    completed,
    timeStamp,
  };

  return AsyncStorage.setItem(videoId, JSON.stringify(data));
};

const getVideoProgress = async (videoId) => {
  const json = await AsyncStorage.getItem(videoId);
  if (json) {
    return JSON.parse(json);
  }
  return {
    completed: false,
    timeStamp: 0,
  };
};

export default App;
*/
