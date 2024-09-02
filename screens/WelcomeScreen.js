import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import * as SQLite from 'expo-sqlite';
import { Colors } from '../constants/styles';

const db = SQLite.openDatabase('sleepData.db'); // Correctly initialize the database synchronously

function WelcomeScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [isDataAvailable, setIsDataAvailable] = useState(false);

  useEffect(() => {
    fetchSleepData();
  }, []);

  const fetchSleepData = () => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT id, rem_quality, deep_sleep_quality, start_date FROM sleep_data ORDER BY timestamp DESC LIMIT 7;`,
        [],
        (txObj, { rows: { _array } }) => {
          if (_array.length > 0) {
            const formattedData = formatChartData(_array);
            setData(formattedData);
            setIsDataAvailable(true);
          } else {
            setIsDataAvailable(false);
          }
        },
        (txObj, error) => {
          console.error('Failed to fetch sleep data:', error);
        }
      );
    });
  };

  const formatChartData = (data) => {
    const labels = data.map(item => new Date(item.start_date).toLocaleDateString());
    const remQualityValues = data.map(item => item.rem_quality);
    const deepSleepQualityValues = data.map(item => item.deep_sleep_quality);

    return {
      labels: labels.reverse(),
      datasets: [
        {
          label: 'REM Quality',
          data: remQualityValues.reverse(),
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        },
        {
          label: 'Deep Sleep Quality',
          data: deepSleepQualityValues.reverse(),
          color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`,
        }
      ]
    };
  };

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Welcome!</Text>

      {isDataAvailable ? (
        <View>
          <Text style={styles.chartTitle}>Sleep Quality (Last 7 Records)</Text>
          <BarChart
            style={styles.chart}
            data={data}
            width={Dimensions.get('window').width - 30}
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: Colors.primary50,
              backgroundGradientFrom: Colors.primary400,
              backgroundGradientTo: Colors.primary600,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              barPercentage: 0.5,
            }}
            verticalLabelRotation={30}
          />
        </View>
      ) : (
        <Text style={styles.noDataText}>No sleep data available. Start by adding some records.</Text>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Show Records"
          onPress={() => navigation.navigate('RecordsScreen')}
          color={Colors.primary500}
          disabled={!isDataAvailable}
        />
      </View>
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.primary700,
    textAlign: 'center',
  },
  chartTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: Colors.primary600,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataText: {
    fontSize: 16,
    color: Colors.primary800,
    marginVertical: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
});
