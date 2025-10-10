
import React from 'react';
import { View, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';

type OrderByModalProps = {
  visible: boolean;
  onClose: () => void;
};

const OrderByModal: React.FC<OrderByModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View style={styles.modalView}>
          <ThemedText type="subtitle" style={{paddingBottom: 20}}>Order by</ThemedText>
          <View style={styles.option}>
            <ThemedText>Manual</ThemedText>
          </View>
          <View style={styles.separator} />
          <View style={styles.option}>
            <ThemedText>Last edition</ThemedText>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  option: {
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#E5E5E5',
  },
});

export default OrderByModal;
