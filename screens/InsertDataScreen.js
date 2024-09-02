// InsertDataScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import { Colors } from '../constants/styles'; // Ensure you have this file or adjust accordingly

function InsertDataScreen({ navigation }) {
  // Define state for each variable (0 to 10)
  const [remQuality, setRemQuality] = useState(5);
  const [deepSleepQuality, setDeepSleepQuality] = useState(5);
  
  const [stress, setStress] = useState(5);
  const [anxiety, setAnxiety] = useState(5);
  const [mind, setMind] = useState(5);
  const [worries, setWorries] = useState(5);
  const [tiredness, setTiredness] = useState(5);
  const [rumination, setRumination] = useState(5);
  const [aerobicLevel, setAerobicLevel] = useState(5);
  const [strengthLevel, setStrengthLevel] = useState(5);

  // State for date pickers
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // State to control date picker visibility
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS sleep_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          start_date TEXT,
          end_date TEXT,
          rem_quality INTEGER,
          deep_sleep_quality INTEGER,
          stress INTEGER,
          anxiety INTEGER,
          mind INTEGER,
          worries INTEGER,
          tiredness INTEGER,
          rumination INTEGER,
          aerobic_level INTEGER,
          strength_level INTEGER,
          timestamp TEXT
        );`
      );
    });
  }, []);

  // Handle date changes
  const onChangeStartDate = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onChangeEndDate = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  // Function to save data
  const saveData = async () => {
    // Validate date range
    if (endDate <= startDate) {
      Alert.alert('Invalid Dates', 'End date must be after start date.');
      return;
    }

    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO sleep_data (start_date, end_date, rem_quality, deep_sleep_quality, stress, anxiety, mind, worries, tiredness, rumination, aerobic_level, strength_level, timestamp) 
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          startDate.toISOString(),
          endDate.toISOString(),
          remQuality,
          deepSleepQuality,
          stress,
          anxiety,
          mind,
          worries,
          tiredness,
          rumination,
          aerobicLevel,
          strengthLevel,
          new Date().toISOString(),
        ],
        (txObj, resultSet) => {
          Alert.alert('Success', 'Data saved successfully!', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        },
        (txObj, error) => {
          console.error('Error saving data:', error);
          Alert.alert('Error', 'Failed to save data.');
        }
      );
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.rootContainer}>
      <Text style={styles.title}>Insert Sleep Data</Text>

      {/* Date Range Selection */}
      <View style={styles.dateContainer}>
        <Text style={styles.sectionTitle}>Sleep Period</Text>
        <View style={styles.datePicker}>
          <Text style={styles.dateLabel}>Start Date:</Text>
          <Button title={startDate.toLocaleDateString()} onPress={() => setShowStartPicker(true)} />
        </View>
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={onChangeStartDate}
          />
        )}
        <View style={styles.datePicker}>
          <Text style={styles.dateLabel}>End Date:</Text>
          <Button title={endDate.toLocaleDateString()} onPress={() => setShowEndPicker(true)} />
        </View>
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={onChangeEndDate}
          />
        )}
      </View>

      {/* Quality Data Sliders */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quality Data</Text>
        {renderSlider('REM Quality', remQuality, setRemQuality)}
        {renderSlider('Deep Sleep Quality', deepSleepQuality, setDeepSleepQuality)}
      </View>

      {/* Quantity Data Sliders */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quantity Data</Text>
        {renderSlider('Stress', stress, setStress)}
        {renderSlider('Anxiety', anxiety, setAnxiety)}
        {renderSlider('Mind', mind, setMind)}
        {renderSlider('Worries', worries, setWorries)}
        {renderSlider('Tiredness', tiredness, setTiredness)}
        {renderSlider('Rumination', rumination, setRumination)}
        {renderSlider('Aerobic Level', aerobicLevel, setAerobicLevel)}
        {renderSlider('Strength Level', strengthLevel, setStrengthLevel)}
      </View>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <Button title="Save Data" onPress={saveData} color={Colors.primary500} />
      </View>
    </ScrollView>
  );
}

export default InsertDataScreen;

const styles = StyleSheet.create({
  rootContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: Colors.primary700,
  },
  section: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: Colors.primary600,
  },
  sliderContainer: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.primary800,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  dateContainer: {
    marginVertical: 15,
    padding: 10,
    backgroundColor: Colors.primary50,
    borderRadius: 8,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  dateLabel: {
    fontSize: 16,
    color: Colors.primary800,
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
});
