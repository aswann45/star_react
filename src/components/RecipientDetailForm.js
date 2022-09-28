import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiProvider';
import { useLocation, useOutletContext } from 'react-router-dom';

import Form from 'react-bootstrap/Form';

import InputField from './form/InputField';
import Loader from './loaders/Loader';

function RecipientDetailForm() {
  const [request_url, 
    request_id, 
    handleSubmit, 
    handleBlur, 
    handleInputChange, 
    formErrors] = useOutletContext();
  const location = useLocation();
  const [detail, setDetail] = useState();
  const api = useApi();
  const url = request_url + '/recipient';

  useEffect(() => {
    (async () => {
      const response = await api.get(url);
      setDetail(response.ok ? response.body 
        : response.body.length === undefined ? null 
        : null);
    })();
  }, [api, url]);

  return (
    <>
      {(detail && Object.keys(detail).length !== 0) ?
        <>
        <Form onSubmit={handleSubmit}>
          <InputField
            name="RecipientLegalName"
            label="Recipient Organization"
            defaultValue={detail.RecipientLegalName}
            changeHandler={handleInputChange}
            helperText="Legal name of the organization to receive funding."
            blurHandler={handleBlur} 
            error={formErrors.RecipientLegalName} />
          <InputField
            name="OrganizationEIN"
            label="Organization EIN"
            defaultValue={detail.OrganizationEIN}
            changeHandler={handleInputChange}
            helperText="Recipient organization's taxpayer identification number."
            blurHandler={handleBlur} 
            error={formErrors.OrganizationEIN} />
          <InputField
            name="RecipientAddress"
            label="Recipient Address"
            defaultValue={detail.RecipientAddress}
            changeHandler={handleInputChange}
            blurHandler={handleBlur} 
            error={formErrors.RecipientAddress} />
          <InputField
            name="RecipientAddress2"
            label="Recipient Address 2"
            defaultValue={detail.RecipientAddress2}
            changeHandler={handleInputChange}
            blurHandler={handleBlur} 
            error={formErrors.RecipientAddress2} />
          <InputField
            name="RecipientCity"
            label="Recipient City"
            defaultValue={detail.RecipientCity}
            changeHandler={handleInputChange}
            blurHandler={handleBlur} 
            error={formErrors.RecipientCity} />
          <InputField
            name="RecipientState"
            label="Recipient State"
            defaultValue={detail.RecipientState}
            changeHandler={handleInputChange}
            blurHandler={handleBlur} 
            error={formErrors.RecipientState} />
          <InputField
            name="RecipientZip"
            label="Recipient Zip"
            defaultValue={detail.RecipientZip}
            changeHandler={handleInputChange}
            blurHandler={handleBlur} 
            error={formErrors.RecipientZip} />
          <InputField
            name="OrganizationSupportInfo"
            label="Organization Supporting Information"
            as_type="textarea"
            defaultValue={detail.OrganizationSupportInfo}
            changeHandler={handleInputChange}
            helperText="Background and supporting information about the organization."
            blurHandler={handleBlur}
            error={formErrors.OrganizationSupportInfo}  />
          <InputField
            name="RecipientPointofContact"
            label="Point of Contact"
            defaultValue={detail.RecipientPointofContact}
            changeHandler={handleInputChange}
            blurHandler={handleBlur} 
            helperText="Point of contact for the recipient organization."
            error={formErrors.RecipientPointofContact} />
          <InputField
            name="PointofContactEmail"
            label="Point of Contact Email"
            defaultValue={detail.PointofContactEmail}
            changeHandler={handleInputChange}
            blurHandler={handleBlur} 
            error={formErrors.PointofContactEmail} />
          <InputField
            name="PointofContactPhone"
            label="Point of Contact Phone"
            defaultValue={detail.PointofContactPhone}
            changeHandler={handleInputChange}
            blurHandler={handleBlur} 
            error={formErrors.PointofContactPhone} />
        </Form>
        </>
        :
        <Loader obj={detail} />
      }
    </>
  );
}

export default RecipientDetailForm;
