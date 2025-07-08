#!/bin/bash
echo "Buscando <div> en componentes React del frontend..."
grep -rn --include="*.jsx" --include="*.js" "<div" frontend/src/components/ | cut -c1-200
echo
echo "Revisa cada resultado y reemplaza <div> por la etiqueta semántica adecuada."
