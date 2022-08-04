#!/usr/bin/env bash

./bin.js Bin leider nicht der Meinung, dass es gut läuft.
# 7.2s
# >Unfortunately, I do not believe that things are going well.
# 2022>Unfortunately, I am not of the opinion that things are going well.

time node bin.js "Was immer du tun oder träumen kannnnst, beginne es. Kühnheit hat Genieee, Kraft und Magie."
# >Whatever you can do or dream, start it. Boldness has genius, strength and magic.
# 2022>Whatever you do or dream, start it. Geniee, strength and magic is bold.

# test streaming capabilities
time echo "Simpego - App-Store - Schreibfehler - Diverse wäre korrekt" | node bin.js
# >Simpego - App Store - Typo - Diverse would be correct
# 2022>Simpego - app store - typing error - Various would be correct

# test long strings
time cat testLongString.txt | ./bin.js
# Nicolas Machiavelli. Italian diplomat of the 16th century [cut] and similar supplies. I found among M

# translate de => chinesse
./bin.js -o zn-CN Bin leider nicht der Meinung, dass es gut läuft.
# 不幸的是，我不认为情况进展顺利。
# Bùxìng de shì, wǒ bù rènwéi qíngkuàng jìnzhǎn shùnlì.

# reverse translation chinesse => de
./bin.js -o de 不幸的是，我不认为情况进展顺利。
# 不幸的是，我不认为情况进展顺利。
# Leider denke ich nicht, dass die Situation reibungslos verläuft.