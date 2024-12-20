import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';

const DetailScreen = ({ route }: { route: any }) => {
  const { imageUri } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState<any | null>(null);

  const uploadImage = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: 'image.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await axios.post(
        'http://192.168.1.5:8080/predict',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setResponseData(response.data);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {responseData ? (
        <View>
          <Text>Class ID: {responseData.class_id}</Text>
          <Text>Class Name: {responseData.class_name}</Text>
          <Text>Processing Time: {responseData.processing_time}s</Text>
          <Image
            source={{ uri: responseData.uploaded_image_url }}
            style={styles.image}
          />
        </View>
      ) : (
        <>
          <Image source={{ uri: imageUri }} style={styles.image} />
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button title="Upload Image" onPress={uploadImage} />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default DetailScreen;
