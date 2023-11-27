#!/bin/bash
#echo "IMPORTANTE: O backend da Maresk se refere a alguns deadlines de modo diferente do frontend. Seguem suas definições:"
#echo "1. Container Gate In <-> Commercial Cargo Cutoff"
#echo "2. Shipping Instructions: AMS <-> Advanced Manifest Submission Deadline"
curl 'localhost:3000/maersk/aggregated_ship_info?port_names=Rio%20Grande,Santos'