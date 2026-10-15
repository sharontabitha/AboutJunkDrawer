export const seedContent = {
  version: 3,
  parts: [
    { id: "p1", cat: "Component", name: "Resistor", desc: "Limits current flow. Its value is read from coloured bands and measured in ohms (Ω).", spec: "V = I × R" },
    { id: "p2", cat: "Component", name: "Diode", desc: "Lets current pass in one direction only. Used for rectifying and protecting circuits.", spec: "Silicon drop ≈ 0.7 V" },
    { id: "p3", cat: "Component", name: "Transistor", desc: "A switch or amplifier: a small signal at the base or gate controls a much larger current.", spec: "BJT · MOSFET" },
    { id: "p4", cat: "Component", name: "Capacitor", desc: "Stores charge briefly. Smooths power supplies and filters electrical noise.", spec: "Unit: farad (F)" },
    { id: "p5", cat: "Component", name: "LED", desc: "A diode that emits light. Always pair it with a series resistor.", spec: "≈ 2 V · 20 mA" },
    { id: "p6", cat: "Microcontroller", name: "Arduino Uno", desc: "Beginner-friendly board built on the ATmega328P, with 14 digital and 6 analog pins.", spec: "5 V · 16 MHz · 32 KB flash" },
    { id: "p7", cat: "Microcontroller", name: "ESP32", desc: "Dual-core microcontroller with built-in Wi-Fi and Bluetooth. A favourite for IoT projects.", spec: "3.3 V · 240 MHz · Wi-Fi + BLE" },
    { id: "p8", cat: "Microcontroller", name: "ESP8266", desc: "Low-cost Wi-Fi microcontroller, great for simple connected gadgets.", spec: "3.3 V · 80 MHz" },
    { id: "p9", cat: "Microcontroller", name: "Raspberry Pi Pico", desc: "RP2040 board with two cores and programmable I/O state machines.", spec: "3.3 V · 133 MHz" },
    { id: "p10", cat: "Computer", name: "CPU", desc: "The processor that executes instructions. Speed is shown in GHz, power in cores and threads.", spec: "Cores · Threads · Cache" },
    { id: "p11", cat: "Computer", name: "RAM", desc: "Short-term memory used by running programs. Its contents are lost when power is off.", spec: "DDR4 · DDR5" },
    { id: "p12", cat: "Computer", name: "Motherboard", desc: "The main circuit board that connects the CPU, RAM, storage and peripherals.", spec: "ATX · mATX · ITX" },
    { id: "p13", cat: "Computer", name: "Power Supply (PSU)", desc: "Converts mains AC into the DC voltages a computer needs.", spec: "3.3 V · 5 V · 12 V rails" },
    { id: "p14", cat: "Computer", name: "Solid-state drive (SSD)", desc: "Non-volatile flash storage with no moving parts. SATA drives are widely compatible; NVMe drives connect over PCIe for higher throughput.", spec: "SATA · NVMe · NAND flash" },
    { id: "p15", cat: "Microcontroller", name: "Teensy 4.0", desc: "Compact development board built around a fast ARM Cortex-M7 processor. Its digital pins use 3.3 V logic and are not 5 V tolerant.", spec: "600 MHz · 3.3 V logic · USB" },
    { id: "p16", cat: "Component", name: "Solderless breadboard", desc: "Reusable prototyping board for building circuits without solder. Groups of five holes connect internally, with a center gap for DIP chips.", spec: "Tie points · power rails · no solder" }
  ],
  articles: [
    { id: "a1", title: "Reading resistor colour bands", by: "junkdrawer", body: "Each band is a digit, the next-to-last is a multiplier and the last is tolerance. Brown-black-red-gold means 1, 0, ×100 = 1 kΩ, ±5%. Start reading from the side opposite the gold or silver band." },
    { id: "a2", title: "Arduino vs ESP32: which should you pick?", by: "junkdrawer", body: "Pick an Arduino Uno to learn the basics: it is simple, 5 V and forgiving. Pick an ESP32 when you need Wi-Fi, Bluetooth or more speed, and remember its pins are 3.3 V only." },
    { id: "a3", title: "A transistor is just a switch you control with a signal", by: "junkdrawer", body: "Apply a small current to an NPN transistor's base and it lets a larger current flow from collector to emitter. That is how a 5 V pin can drive a motor or a relay safely." }
  ]
};