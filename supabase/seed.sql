insert into public.parts (category, name, description, spec)
select seed.category, seed.name, seed.description, seed.spec
from (values
  ('Component', 'Resistor', 'Limits current flow. Its value is read from coloured bands and measured in ohms (Ω).', 'V = I × R'),
  ('Component', 'Diode', 'Lets current pass in one direction only. Used for rectifying and protecting circuits.', 'Silicon drop ≈ 0.7 V'),
  ('Component', 'Transistor', 'A switch or amplifier: a small signal at the base or gate controls a much larger current.', 'BJT · MOSFET'),
  ('Component', 'Capacitor', 'Stores charge briefly. Smooths power supplies and filters electrical noise.', 'Unit: farad (F)'),
  ('Component', 'LED', 'A diode that emits light. Always pair it with a series resistor.', '≈ 2 V · 20 mA'),
  ('Microcontroller', 'Arduino Uno', 'Beginner-friendly board built on the ATmega328P, with 14 digital and 6 analog pins.', '5 V · 16 MHz · 32 KB flash'),
  ('Microcontroller', 'ESP32', 'Dual-core microcontroller with built-in Wi-Fi and Bluetooth. A favourite for IoT projects.', '3.3 V · 240 MHz · Wi-Fi + BLE'),
  ('Microcontroller', 'ESP8266', 'Low-cost Wi-Fi microcontroller, great for simple connected gadgets.', '3.3 V · 80 MHz'),
  ('Microcontroller', 'Raspberry Pi Pico', 'RP2040 board with two cores and programmable I/O state machines.', '3.3 V · 133 MHz'),
  ('Computer', 'CPU', 'The processor that executes instructions. Speed is shown in GHz, power in cores and threads.', 'Cores · Threads · Cache'),
  ('Computer', 'RAM', 'Short-term memory used by running programs. Its contents are lost when power is off.', 'DDR4 · DDR5'),
  ('Computer', 'Motherboard', 'The main circuit board that connects the CPU, RAM, storage and peripherals.', 'ATX · mATX · ITX'),
  ('Computer', 'Power Supply (PSU)', 'Converts mains AC into the DC voltages a computer needs.', '3.3 V · 5 V · 12 V rails'),
  ('Computer', 'Solid-state drive (SSD)', 'Non-volatile flash storage with no moving parts. SATA drives are widely compatible; NVMe drives connect over PCIe for higher throughput.', 'SATA · NVMe · NAND flash'),
  ('Microcontroller', 'Teensy 4.0', 'Compact development board built around a fast ARM Cortex-M7 processor. Its digital pins use 3.3 V logic and are not 5 V tolerant.', '600 MHz · 3.3 V logic · USB'),
  ('Component', 'Solderless breadboard', 'Reusable prototyping board for building circuits without solder. Groups of five holes connect internally, with a center gap for DIP chips.', 'Tie points · power rails · no solder')
) as seed(category, name, description, spec)
where not exists (
  select 1 from public.parts existing where existing.name = seed.name
);

insert into public.articles (title, body, author_name)
select seed.title, seed.body, seed.author_name
from (values
  ('Reading resistor colour bands', 'Each band is a digit, the next-to-last is a multiplier and the last is tolerance. Brown-black-red-gold means 1, 0, ×100 = 1 kΩ, ±5%. Start reading from the side opposite the gold or silver band.', 'junkdrawer'),
  ('Arduino vs ESP32: which should you pick?', 'Pick an Arduino Uno to learn the basics: it is simple, 5 V and forgiving. Pick an ESP32 when you need Wi-Fi, Bluetooth or more speed, and remember its pins are 3.3 V only.', 'junkdrawer'),
  ('A transistor is just a switch you control with a signal', 'Apply a small current to an NPN transistor\'s base and it lets a larger current flow from collector to emitter. That is how a 5 V pin can drive a motor or a relay safely.', 'junkdrawer')
) as seed(title, body, author_name)
where not exists (
  select 1 from public.articles existing where existing.title = seed.title
);