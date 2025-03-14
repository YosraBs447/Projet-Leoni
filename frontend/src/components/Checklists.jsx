import React, { useState } from "react";
import { Button } from "./UI/Button"; // Chemin relatif
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./UI/Table"; // Chemin relatif
import { MoreVertical } from "lucide-react";
import { Menu, MenuItem } from "./UI/Menu"; // Chemin relatif
import "./Checklists.css"; // Assure-toi que le chemin est correct

const Checklists = () => {
  const [checklists, setChecklists] = useState([
    { name: "", site: "", assignedTo: "", date: "", isDisabled: false },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newChecklist, setNewChecklist] = useState({
    name: "",
    site: "",
    assignedTo: "",
    date: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeActions, setActiveActions] = useState(null);
  const [editingRow, setEditingRow] = useState(null);

  // Gérer l'ajout d'une checklist
  const handleAddChecklist = () => {
    if (
      newChecklist.name &&
      newChecklist.site &&
      newChecklist.assignedTo &&
      newChecklist.date
    ) {
      const updatedChecklists =
        checklists[0].name === ""
          ? [{ ...newChecklist }]
          : [...checklists, newChecklist];
      setChecklists(updatedChecklists);
      setNewChecklist({ name: "", site: "", assignedTo: "", date: "" });
      setShowForm(false);
    }
  };

  // Supprimer une checklist
  const handleDeleteChecklist = (index) => {
    const updatedChecklists = [...checklists];
    updatedChecklists.splice(index, 1);
    setChecklists(updatedChecklists);
    setActiveActions(null);
  };

  // Dupliquer une checklist
  const handleDuplicateChecklist = (index) => {
    const checklistToDuplicate = { ...checklists[index] };
    setChecklists([...checklists, checklistToDuplicate]);
    setActiveActions(null);
  };

  // Modifier une checklist
  const handleModifyChecklist = (index) => {
    setEditingRow(index);
  };

  // Désactiver une checklist (changer la couleur de la ligne)
  const handleDeactivateChecklist = (index) => {
    const updatedChecklists = [...checklists];
    updatedChecklists[index].isDisabled = true; // Marquer comme désactivée
    setChecklists(updatedChecklists);
    setActiveActions(null);
  };

  // Gérer la modification d'une ligne
  const handleInputChange = (e, index, column) => {
    const updatedChecklists = [...checklists];
    updatedChecklists[index][column] = e.target.value;
    setChecklists(updatedChecklists);
  };

  const handleInputKeyDown = (e, index) => {
    if (e.key === "Enter") {
      setEditingRow(null); // Fermer l'édition lorsque l'on appuie sur Entrée
    }
  };

  // Filtrer les checklists
  const filteredChecklists = checklists.filter((checklist) =>
    checklist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Actions de la checklist
  const handleAction = (action, index) => {
    switch (action) {
      case "Modifier":
        handleModifyChecklist(index);
        break;
      case "Dupliquer":
        handleDuplicateChecklist(index);
        break;
      case "Désactiver":
        handleDeactivateChecklist(index);
        break;
      case "Supprimer":
        handleDeleteChecklist(index);
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-4">
      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher une checklist..."
        className="block p-2 border rounded mb-4 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Bouton Ajouter Checklist */}
      <Button
        onClick={() => setShowForm(!showForm)} // Toggle la visibilité du formulaire
        className="mb-4"
      >
        Ajouter Checklist
      </Button>

      {/* Formulaire pour ajouter une checklist */}
      {showForm && (
        <div className="p-4 border rounded bg-gray-100">
          <input
            type="text"
            placeholder="Nom"
            className="block p-2 border rounded mb-2 w-full"
            value={newChecklist.name}
            onChange={(e) =>
              setNewChecklist({ ...newChecklist, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Site"
            className="block p-2 border rounded mb-2 w-full"
            value={newChecklist.site}
            onChange={(e) =>
              setNewChecklist({ ...newChecklist, site: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Assigné à"
            className="block p-2 border rounded mb-2 w-full"
            value={newChecklist.assignedTo}
            onChange={(e) =>
              setNewChecklist({ ...newChecklist, assignedTo: e.target.value })
            }
          />
          <input
            type="date"
            className="block p-2 border rounded mb-2 w-full"
            value={newChecklist.date}
            onChange={(e) =>
              setNewChecklist({ ...newChecklist, date: e.target.value })
            }
          />
          <Button onClick={handleAddChecklist} className="mt-2">
            Entrer
          </Button>
        </div>
      )}

      {/* Table des checklists */}
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Site</TableHead>
            <TableHead>Assigné à</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredChecklists.map((checklist, index) => (
            <TableRow
              key={index}
              style={{
                backgroundColor: checklist.isDisabled ? "red" : "", // Si désactivé, ligne rouge
              }}
            >
              <TableCell>
                {editingRow === index ? (
                  <input
                    type="text"
                    value={checklist.name}
                    onChange={(e) => handleInputChange(e, index, "name")}
                    onKeyDown={(e) => handleInputKeyDown(e, index)} // Enregistrer avec "Enter"
                  />
                ) : (
                  checklist.name
                )}
              </TableCell>
              <TableCell>
                {editingRow === index ? (
                  <input
                    type="text"
                    value={checklist.site}
                    onChange={(e) => handleInputChange(e, index, "site")}
                    onKeyDown={(e) => handleInputKeyDown(e, index)} // Enregistrer avec "Enter"
                  />
                ) : (
                  checklist.site
                )}
              </TableCell>
              <TableCell>
                {editingRow === index ? (
                  <input
                    type="text"
                    value={checklist.assignedTo}
                    onChange={(e) => handleInputChange(e, index, "assignedTo")}
                    onKeyDown={(e) => handleInputKeyDown(e, index)} // Enregistrer avec "Enter"
                  />
                ) : (
                  checklist.assignedTo
                )}
              </TableCell>
              <TableCell>{checklist.date}</TableCell>
              <TableCell>
                {/* Afficher "Désactivée" si la checklist est désactivée */}
                {checklist.isDisabled ? (
                  "Désactivée"
                ) : (
                  <Button
                    className="p-2 bg-transparent"
                    onClick={() =>
                      setActiveActions(activeActions === index ? null : index)
                    }
                  >
                    <MoreVertical />
                  </Button>
                )}
                {activeActions === index && !checklist.isDisabled && (
                  <div className="absolute bg-white border rounded shadow-md">
                    <Menu>
                      <MenuItem onClick={() => handleAction("Modifier", index)}>
                        Modifier
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleAction("Dupliquer", index)}
                      >
                        Dupliquer
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleAction("Désactiver", index)}
                      >
                        Désactiver
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleAction("Supprimer", index)}
                      >
                        Supprimer
                      </MenuItem>
                    </Menu>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Checklists;
