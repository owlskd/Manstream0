// script.js - Main JavaScript for Manstream website

// Consultation Quiz Logic
if (document.getElementById('skincare-quiz')) {
  document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('skincare-quiz');
    const steps = document.querySelectorAll('.step-content');
    const stepIndicators = document.querySelectorAll('.step');
    const progressBar = document.getElementById('progress-bar');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const beardYesRadio = document.getElementById('beard_yes');
    const beardNoRadio = document.getElementById('beard_no');
    const beardConditionQuestion = document.getElementById('beard-condition-question');

    let currentStep = 0;
    const totalSteps = steps.length;

    // Update progress bar
    function updateProgressBar() {
      const progress = ((currentStep + 1) / totalSteps) * 100;
      progressBar.style.width = `${progress}%`;
    }

    // Show current step
    function showStep(stepIndex) {
      steps.forEach((step, index) => {
        if (index === stepIndex) {
          step.classList.remove('hidden');
          step.classList.add('fade-in');
        } else {
          step.classList.add('hidden');
          step.classList.remove('fade-in');
        }
      });

      stepIndicators.forEach((indicator, index) => {
        if (index < stepIndex) {
          indicator.classList.add('completed');
          indicator.classList.remove('active');
        } else if (index === stepIndex) {
          indicator.classList.add('active');
          indicator.classList.remove('completed');
        } else {
          indicator.classList.remove('active', 'completed');
        }
      });

      updateProgressBar();
    }

    // Next step button click
    nextButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Validate current step
        if (validateStep(currentStep)) {
          currentStep++;
          if (currentStep < totalSteps) {
            showStep(currentStep);
          }
        }
      });
    });

    // Previous step button click
    prevButtons.forEach(button => {
      button.addEventListener('click', () => {
        currentStep--;
        if (currentStep >= 0) {
          showStep(currentStep);
        }
      });
    });

    // Validate step
    function validateStep(stepIndex) {
      switch(stepIndex) {
        case 0: // Skin Condition
          const skinCondition = form.querySelector('input[name="skin_condition"]:checked');
          if (!skinCondition) {
            alert('Silakan pilih kondisi kulit Anda.');
            return false;
          }
          return true;
        case 1: // Skin Issues
          const skinIssues = form.querySelectorAll('input[name="skin_issues"]:checked');
          if (skinIssues.length === 0) {
            alert('Silakan pilih minimal satu masalah kulit.');
            return false;
          }
          return true;
        case 2: // Breath Condition
          const breathCondition = form.querySelector('input[name="breath_condition"]:checked');
          if (!breathCondition) {
            alert('Silakan pilih kondisi napas Anda.');
            return false;
          }
          return true;
        case 3: // Beard
          const hasBeard = form.querySelector('input[name="has_beard"]:checked');
          if (!hasBeard) {
            alert('Silakan pilih apakah Anda memiliki jenggot.');
            return false;
          }
          if (hasBeard.value === 'ya') {
            const beardCondition = form.querySelector('input[name="beard_condition"]:checked');
            if (!beardCondition) {
              alert('Silakan pilih kondisi jenggot Anda.');
              return false;
            }
          }
          return true;
        default:
          return true;
      }
    }

    // Handle beard condition question visibility
    beardYesRadio.addEventListener('change', () => {
      if (beardYesRadio.checked) {
        beardConditionQuestion.classList.remove('hidden');
        beardConditionQuestion.classList.add('fade-in');
      }
    });
    beardNoRadio.addEventListener('change', () => {
      if (beardNoRadio.checked) {
        beardConditionQuestion.classList.add('hidden');
        // Reset beard condition selection
        const beardConditionRadios = document.querySelectorAll('input[name="beard_condition"]');
        beardConditionRadios.forEach(radio => {
          radio.checked = false;
        });
      }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      // Validate final step
      if (!validateStep(currentStep)) {
        return;
      }
      // Collect form data
      const formData = new FormData(form);
      const quizData = {};
      for (let [key, value] of formData.entries()) {
        if (key === 'skin_issues') {
          if (!quizData[key]) {
            quizData[key] = [];
          }
          quizData[key].push(value);
        } else {
          quizData[key] = value;
        }
      }
      // Store data in localStorage
      localStorage.setItem('manstream_quiz_data', JSON.stringify(quizData));
      // Redirect to recommendations page
      window.location.href = 'rekomendasi.html';
    });

    // Initialize first step
    showStep(currentStep);

    // Custom radio and checkbox styling
    const customInputs = document.querySelectorAll('.custom-radio input, .custom-checkbox input');
    customInputs.forEach(input => {
      input.addEventListener('change', function() {
        if (this.type === 'radio') {
          // Uncheck all other radios in the same group
          const name = this.name;
          document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
            const label = radio.nextElementSibling;
            if (radio.checked) {
              label.classList.add('checked');
            } else {
              label.classList.remove('checked');
            }
          });
        } else if (this.type === 'checkbox') {
          const label = this.nextElementSibling;
          if (this.checked) {
            label.classList.add('checked');
          } else {
            label.classList.remove('checked');
          }
        }
      });
    });
  });
}

// Add your custom JS below this line 