// src/components/HairCaseReport.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormLabel,
  CFormInput,
  CCol,
  CRow,
} from "@coreui/react";

const addHairCaseReport = () => {
  const [formData, setFormData] = useState({
    complaintsOf: "",
    hairFallLoss: "",
    hairLossSince: "",
    dandruff: "",
    prematureGreyingSince: "",
    hairFallNumberOfStrands: "",
    otherComplaints: "",
    hairPhotographs: "",
    hairVolume: "",
    hairThickness: "",
    hairTexture: "",
    hairColor: "",
    otherFindings: "",
    trichotillomania: "",
    treatmentAdvice: "",
    hrt: "",
    prp: "",
    medications: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., POST to an API
    console.log("Form data submitted:", formData);
  };

  return (
    <CCard className="mb-5">
      <CCardHeader>
        <span>Hair Case Report</span>
      </CCardHeader>
      <CCardBody>
        <form onSubmit={handleSubmit}>
          <CRow>
            <CCol md={4}>
              <CFormLabel htmlFor="complaintsOf">Complaints of:</CFormLabel>
              <CFormInput
                type="text"
                id="complaintsOf"
                name="complaintsOf"
                value={formData.complaintsOf}
                onChange={handleChange}
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel htmlFor="hairFallLoss">Hair fall/loss:</CFormLabel>
              <CFormInput
                type="text"
                id="hairFallLoss"
                name="hairFallLoss"
                value={formData.hairFallLoss}
                onChange={handleChange}
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel htmlFor="hairLossSince">Hair loss since:</CFormLabel>
              <CFormInput
                type="text"
                id="hairLossSince"
                name="hairLossSince"
                value={formData.hairLossSince}
                onChange={handleChange}
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel htmlFor="dandruff">Dandruff:</CFormLabel>
              <CFormInput
                type="text"
                id="dandruff"
                name="dandruff"
                value={formData.dandruff}
                onChange={handleChange}
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel htmlFor="prematureGreyingSince">
                Premature greying since:
              </CFormLabel>
              <CFormInput
                type="text"
                id="prematureGreyingSince"
                name="prematureGreyingSince"
                value={formData.prematureGreyingSince}
                onChange={handleChange}
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel htmlFor="hairFallNumberOfStrands">
                Hair fall number of strands:
              </CFormLabel>
              <CFormInput
                type="text"
                id="hairFallNumberOfStrands"
                name="hairFallNumberOfStrands"
                value={formData.hairFallNumberOfStrands}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={4}>
              <CFormLabel htmlFor="otherComplaints">
                Other complaints if any:
              </CFormLabel>
              <CFormInput
                type="text"
                id="otherComplaints"
                name="otherComplaints"
                value={formData.otherComplaints}
                onChange={handleChange}
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel htmlFor="hairPhotographs">
                Hair photographs:
              </CFormLabel>
              <CFormInput
                type="text"
                id="hairPhotographs"
                name="hairPhotographs"
                value={formData.hairPhotographs}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={4}>
              <CFormLabel htmlFor="hairVolume">Hair volume:</CFormLabel>
              <CFormInput
                type="text"
                id="hairVolume"
                name="hairVolume"
                value={formData.hairVolume}
                onChange={handleChange}
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel htmlFor="hairThickness">Hair thickness:</CFormLabel>
              <CFormInput
                type="text"
                id="hairThickness"
                name="hairThickness"
                value={formData.hairThickness}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={4}>
              <CFormLabel htmlFor="hairTexture">Hair texture:</CFormLabel>
              <CFormInput
                type="text"
                id="hairTexture"
                name="hairTexture"
                value={formData.hairTexture}
                onChange={handleChange}
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel htmlFor="hairColor">Hair color:</CFormLabel>
              <CFormInput
                type="text"
                id="hairColor"
                name="hairColor"
                value={formData.hairColor}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={12}>
              <CFormLabel htmlFor="otherFindings">Other findings:</CFormLabel>
              <CFormInput
                type="text"
                id="otherFindings"
                name="otherFindings"
                value={formData.otherFindings}
                onChange={handleChange}
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol md={4}>
              <CFormLabel htmlFor="trichotillomania">
                Trichotillomania:
              </CFormLabel>
              <CFormInput
                type="text"
                id="trichotillomania"
                name="trichotillomania"
                value={formData.trichotillomania}
                onChange={handleChange}
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel htmlFor="treatmentAdvice">
                Treatment advice:
              </CFormLabel>
              <CFormInput
                type="text"
                id="treatmentAdvice"
                name="treatmentAdvice"
                value={formData.treatmentAdvice}
                onChange={handleChange}
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol md={4}>
              <CFormLabel htmlFor="hrt">HRT:</CFormLabel>
              <CFormInput
                type="text"
                id="hrt"
                name="hrt"
                value={formData.hrt}
                onChange={handleChange}
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel htmlFor="prp">PRP:</CFormLabel>
              <CFormInput
                type="text"
                id="prp"
                name="prp"
                value={formData.prp}
                onChange={handleChange}
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel htmlFor="medications">Medications:</CFormLabel>
              <CFormInput
                type="text"
                id="medications"
                name="medications"
                value={formData.medications}
                onChange={handleChange}
              />
            </CCol>
          </CRow>
          <CButton color="primary" type="submit" className="mt-3">
            Submit
          </CButton>
        </form>
      </CCardBody>
    </CCard>
  );
};

export default addHairCaseReport;
