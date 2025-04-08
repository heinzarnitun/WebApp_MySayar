import React, { useState } from 'react';
import axios from 'axios'; // Make sure axios is installed (npm install axios)
import Select from 'react-select';
import API_URL from '../api';

const AddTutorProfile = () => {
    const userId = localStorage.getItem('user_id');
  const [formData, setFormData] = useState({
    user_id:'',
    name: '',
    gender: '',
    date_of_birth: '',
    biography: '',
    subjects: [],
    hourly_rate: '',
    location: '',
    tutoringMode: [], // Update to an array for checkbox options
    experience: '',
    education_background: '',
    image: null
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubjectChange = (selectedSubjects) => {
    setFormData({
      ...formData,
      subjects: selectedSubjects
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleLocationChange = (e) => {
    setFormData({
      ...formData,
      location: e.target.value
    });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      // If checked, add to array, otherwise remove
      const newTutoringMode = checked
        ? [...prevData.tutoringMode, value]
        : prevData.tutoringMode.filter((item) => item !== value);
      return { ...prevData, tutoringMode: newTutoringMode };
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent default form submission

  // Debug: Check the structure of subjects before transformation
  console.log('Subjects before transformation:', formData.subjects);

  // Transform subjects array to an array of values
  const subjectsArray = formData.subjects.map(subject => subject.value);

  // Debug: Check the transformed subjects array
  console.log('Transformed Subjects Array:', subjectsArray);
   const userId = parseInt(localStorage.getItem("user_id"), 10); // Convert to integer
console.log(userId); // Check if it is an integer

if (isNaN(userId)) {
    console.error("User ID is not a valid integer");
}


  const formDataToSubmit = new FormData();

     formDataToSubmit.append('user_id',userId);
  formDataToSubmit.append('name', formData.name);
  formDataToSubmit.append('gender', formData.gender);
  formDataToSubmit.append('date_of_birth', formData.date_of_birth);
  formDataToSubmit.append('biography', formData.biography);

  // Send subjects as a JSON string
/*subjectsArray.forEach((subject) => {
    formDataToSubmit.append('subjects[]', subject); // Use 'subjects[]' for arrays
  });*/
const subjectsString = subjectsArray.join(',');
formDataToSubmit.append('subjects', subjectsString);
console.log(subjectsString)

  formDataToSubmit.append('hourly_rate', formData.hourly_rate);
  formDataToSubmit.append('location', formData.location);

  // Send tutoring_mode as an array
  /*formData.tutoringMode.forEach((mode) => {
    formDataToSubmit.append('tutoring_mode[]', mode); // Use 'tutoring_mode[]' for arrays
  });*/

  const modesString = formData.tutoringMode.join(',');
  formDataToSubmit.append('tutoring_mode',modesString)
  console.log(modesString)







  formDataToSubmit.append('experience', formData.experience);
  formDataToSubmit.append('education_background', formData.education_background);

  // Check if image is provided
  if (formData.image) formDataToSubmit.append('image', formData.image);

  // Log the formDataToSubmit to check if all required fields are present
  for (let [key, value] of formDataToSubmit.entries()) {
    console.log(key, value);
  }

  try {
    const response = await axios.post(`${API_URL}/api/tutor-profiles`, formDataToSubmit, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    setSuccessMessage('Tutor Profile added successfully!');
    setErrorMessage('');
    setFormData({
        user_id:'',
      name: '',
      gender: '',
      date_of_birth: '',
      biography: '',
      subjects: [],
      hourly_rate: '',
      location: '',
      tutoringMode: [],  // Reset to an empty array
      experience: '',
      education_background: '',
      image: null,
      user_id: ''  // Ensure user_id is set to an initial value if needed
    });
  } catch (error) {
    console.error('Error details:', error.response?.data || error.message);
    setErrorMessage('Failed to add tutor profile. Please try again.');
    setSuccessMessage('');
  }
};

  // For subjects
const subjects = [
  "Myanmar", "English", "Math", "Science", "Bio", "Chemistry",
  "Geography", "History", "ICT", "Computer Science", "Programming",
  "Business", "Accounting", "Economy", "Medicine", "Engineering"
];

const subjectOptions = subjects.map(subject => ({
  value: subject,  // same as original
  label: subject   // same as original
}));

  // For location
  const locationOptions = ["",
    "Hakha", "Myitkyina", "Loikaw", "Hpa-An", "Mawlamyine", 
    "Sittwe", "Taunggyi", "Pathein", "Bago", "Magway", 
    "Mandalay", "Monywa", "Dawei", "Yangon", "NayPyiTaw"
  ];

  return (
    <div className="container mt-5">
    <h2>Add Tutor Profile</h2>
    <p>User ID: {userId ? userId : 'Not logged in'}</p>

    {successMessage && <div className="alert alert-success">{successMessage}</div>}
    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Name:</label>
        <input
          type="text"
          name="name"
          className="form-control"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="gender" className="form-label">Gender:</label>
        <select
          name="gender"
          className="form-select"
          id="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="" disabled>Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="date_of_birth" className="form-label">Date of Birth:</label>
        <input
          type="date"
          name="date_of_birth"
          className="form-control"
          id="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="biography" className="form-label">Biography:</label>
        <textarea
          name="biography"
          className="form-control"
          id="biography"
          value={formData.biography}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="subjects" className="form-label">Subjects:</label>
        <Select
          isMulti
          options={subjectOptions}
          value={formData.subjects}
          onChange={handleSubjectChange}
          placeholder="Search and select subjects"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="hourly_rate" className="form-label">Hourly Rate (Ks):</label>
        <input
          type="number"
          name="hourly_rate"
          className="form-control"
          id="hourly_rate"
          value={formData.hourly_rate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="location" className="form-label">Location:</label>
        <select
          name="location"
          className="form-select"
          id="location"
          value={formData.location}
          onChange={handleLocationChange}
          required
        >
          {locationOptions.map((loc, index) => (
            <option key={index} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Tutoring Mode:</label>
        <div>
          <label className="form-check-label me-3">
            <input
              type="checkbox"
              value="online"
              checked={formData.tutoringMode.includes('online')}
              onChange={handleCheckboxChange}
              className="form-check-input"
            />
            Online
          </label>
          <label className="form-check-label me-3">
            <input
              type="checkbox"
              value="in-person"
              checked={formData.tutoringMode.includes('in-person')}
              onChange={handleCheckboxChange}
              className="form-check-input"
            />
            In-person
          </label>
          <label className="form-check-label">
            <input
              type="checkbox"
              value="both"
              checked={formData.tutoringMode.includes('both')}
              onChange={handleCheckboxChange}
              className="form-check-input"
            />
            Both
          </label>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="experience" className="form-label">Experience (Years):</label>
        <input
          type="number"
          name="experience"
          className="form-control"
          id="experience"
          value={formData.experience}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="education_background" className="form-label">Education Background:</label>
        <textarea
          name="education_background"
          className="form-control"
          id="education_background"
          value={formData.education_background}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="image" className="form-label">Profile Image:</label>
        <input
          type="file"
          name="image"
          className="form-control"
          id="image"
          onChange={handleFileChange}
        />
      </div>

      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  </div>
  );
};

export default AddTutorProfile;
