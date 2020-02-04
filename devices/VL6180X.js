/* Copyright (c) 2020 Salvatore Castelbuono. See the file LICENSE for copying permission. */

var C = {
  
  VL6180X_DEFAULT_I2C_ADDR: 0x29,
  VL6180X_REG_I2C_ADDR: 0x0212,                                
  VL6180X_REG_IDENTIFICATION_MODEL_ID: 0x000,                  // Device model identification number
  VL6180X_REG_SYSTEM_INTERRUPT_CONFIG: 0x014,                  // Interrupt configuration
  VL6180X_REG_SYSTEM_INTERRUPT_CLEAR: 0x015,                   // Interrupt clear bits
  VL6180X_REG_SYSTEM_FRESH_OUT_OF_RESET: 0x016,                // Fresh out of reset bit
  VL6180X_REG_SYSRANGE_START: 0x018,                           // Trigger Ranging
  VL6180X_REG_SYSALS_START: 0x038,                             // Trigger Lux Reading
  VL6180X_REG_SYSALS_ANALOGUE_GAIN: 0x03F,                     // Lux reading gain
  VL6180X_REG_SYSALS_INTEGRATION_PERIOD_HI: 0x040,             // Integration period for ALS mode, high byte
  VL6180X_REG_SYSALS_INTEGRATION_PERIOD_LO: 0x041,             // Integration period for ALS mode, low byte
  VL6180X_REG_RESULT_RANGE_STATUS: 0x04d,                      // Specific error codes
  VL6180X_REG_RESULT_INTERRUPT_STATUS_GPIO: 0x04f,             // Interrupt status
  VL6180X_REG_RESULT_ALS_VAL: 0x050,                           // Light reading value
  VL6180X_REG_RESULT_RANGE_VAL: 0x062,                         // Ranging reading value

  //Lux gain - not needed

  VL6180X_ALS_GAIN_1: 0x06,                                    // 1x gain
  VL6180X_ALS_GAIN_1_25: 0x05,                                 // 1.25x gain
  VL6180X_ALS_GAIN_1_67: 0x04,                                 // 1.67x gain
  VL6180X_ALS_GAIN_2_5: 0x03,                                  // 2.5x gain
  VL6180X_ALS_GAIN_5: 0x02,                                    // 5x gain
  VL6180X_ALS_GAIN_10: 0x01,                                   // 10x gain
  VL6180X_ALS_GAIN_20: 0x00,                                   // 20x gain
  VL6180X_ALS_GAIN_40: 0x07,                                   // 40x gain

  VL6180X_ERROR_NONE: 0,                                       // Success!
  VL6180X_ERROR_SYSERR_1: 1,                                   // System error
  VL6180X_ERROR_SYSERR_5: 5,                                   // System error
  VL6180X_ERROR_ECEFAIL: 6,                                    // Early convergence estimate fail
  VL6180X_ERROR_NOCONVERGE: 7,                                 // No target detected
  VL6180X_ERROR_RANGEIGNORE: 8,                                // Ignore threshold check failed
  VL6180X_ERROR_SNR: 11,                                       // Ambient conditions too high
  VL6180X_ERROR_RAWUFLOW: 12,                                  // Raw range algo underflow
  VL6180X_ERROR_RAWOFLOW: 13,                                  // Raw range algo overflow
  VL6180X_ERROR_RANGEUFLOW: 14,                                // Raw range algo underflow
  VL6180X_ERROR_RANGEOFLOW: 15                                 // Raw range algo overflow
};

function VL6180X(i2c, options) {
    this.options = options||{};
    this.i2c = i2c;
    this.ad = C.VL6180X_DEFAULT_I2C_ADDR>>1;
    if (this.options.address) {                                // Change I2C address, if specified in options
     this.ad = this.options.address>>1;
     this.i2c.writeTo(C.VL6180X_DEFAULT_I2C_ADDR>>1, C.VL6180X_REG_I2C_ADDR, this.ad);
    }
    this.loadSettings();
}

//Read and Write 1 byte (8 bit) values 

VL6180X.prototype.read8 = function(reg) {
    this.i2c.writeTo(this.ad, reg >> 8, reg & 0xff);
    var data = this.i2c.readFrom(this.ad, 0x01);
    return data[0];
};

VL6180X.prototype.write8 = function(reg, value) {
    this.i2c.writeTo(this.ad, reg >> 8, reg & 0xff, value);
};

//Read and Write 2 byte (16 bit) values 

VL6180X.prototype.read16 = function(reg) {
    this.i2c.writeTo(this.ad, reg >> 8, reg & 0xff);
    var data = this.i2c.readFrom(this.ad, 0x02);
    return (data[0] << 8) | data[1];
};

VL6180X.prototype.write16 = function(reg, value) {
    this.i2c.writeTo(this.ad, reg >> 8, reg & 0xff, value >> 8, value & 0xff);
};

//Read and Write binary values (HIGH 1, LOW 0)

VL6180X.prototype.read = function(addr,n) {
  this.i2c.writeTo(this.ad, addr);
  return this.i2c.readFrom(this.ad, n);
};
VL6180X.prototype.write = function(addr,d) {
  this.i2c.writeTo(this.ad, addr, d);
};


//Load settings function
VL6180X.prototype.loadSettings = function() {
    // private settings from APPENDIX 1 - Setup Guide

    this.write8(0x0207, 0x01);
    this.write8(0x0208, 0x01);
    this.write8(0x0133, 0x01);
    this.write8(0x0096, 0x00);
    this.write8(0x0097, 0xfd);
    this.write8(0x00e3, 0x00);
    this.write8(0x00e4, 0x04);
    this.write8(0x00e5, 0x02);
    this.write8(0x00e6, 0x01);
    this.write8(0x00e7, 0x03);
    this.write8(0x00f5, 0x02);
    this.write8(0x00d9, 0x05);
    this.write8(0x00db, 0xce);
    this.write8(0x00dc, 0x03);
    this.write8(0x00dd, 0xf8);
    this.write8(0x009f, 0x00);
    this.write8(0x00a3, 0x3c);
    this.write8(0x00b7, 0x00);
    this.write8(0x00bb, 0x3c);
    this.write8(0x00b2, 0x09);
    this.write8(0x00ca, 0x09);
    this.write8(0x0198, 0x01);
    this.write8(0x01b0, 0x17);
    this.write8(0x01ad, 0x00);
    this.write8(0x00ff, 0x05);
    this.write8(0x0100, 0x05);
    this.write8(0x0199, 0x05);
    this.write8(0x0109, 0x07);
    this.write8(0x003f, 0x46);                   // Sets the light and dark gain (upper nibble). Dark gain should not be changed.
    this.write8(0x010a, 0x30);                   // Set the averaging sample period (compromise between lower noise increased execution time)
    this.write8(0x01a6, 0x1b);
    this.write8(0x01ac, 0x3e);
    this.write8(0x01a7, 0x1f);
    this.write8(0x0103, 0x01);
    this.write8(0x0030, 0x00);
    this.write8(0x001b, 0x0a);                   // Set default ranging inter-measurement  period to 100ms
    this.write8(0x003e, 0x0a);                   // Set default ALS inter-measurement period to 500ms\
    this.write8(0x0131, 0x04);
    this.write8(0x0011, 0x10);                   // Enables polling for 'New Sample ready' when measurement completes
    this.write8(0x0014, 0x24);                   // Configures interrupt on 'New Sample - Ready threshold event'
    this.write8(0x0031, 0xFF);                   // Sets the # of range measurements after which auto calibration of system is performed
    this.write8(0x00d2, 0x01);
    this.write8(0x00f2, 0x01);

    this.write8(0x0040, 0x63);                   // Set ALS integration time to 100ms
    this.write8(0x002e, 0x01);                   // perform a single temperature calibration of the ranging sensor
};

//Read range function

VL6180X.prototype.readRange = function() {
    
  while (!(this.read8(C.VL6180X_REG_RESULT_RANGE_STATUS) & 0x01));                // wait for device to be ready for range measurement

  this.write8(C.VL6180X_REG_SYSRANGE_START, 0x01);                            // Start a range measurement

  while (!(this.read8(C.VL6180X_REG_RESULT_INTERRUPT_STATUS_GPIO) & 0x04));        // Poll until bit 2 is set

  var range = this.read8(C.VL6180X_REG_RESULT_RANGE_VAL);                          // read range in mm

  this.write8(C.VL6180X_REG_SYSTEM_INTERRUPT_CLEAR, 0x07);                    // clear interrupt

  return range;
};

//Range status function

VL6180X.prototype.readRangeStatus = function() {
  return this.read8(C.VL6180X_REG_RESULT_RANGE_STATUS) >> 4;
};

exports.connect = function(i2c, options) {
  return new VL6180X(i2c, options);
};
